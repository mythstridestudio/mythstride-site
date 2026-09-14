import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const scanRoots = [
  path.join(root, "src"),
  path.join(root, ".github", "workflows"),
];
const extensions = new Set([".ts", ".tsx", ".js", ".mjs", ".yml", ".yaml"]);
const failures = [];

async function walk(directory) {
  const files = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target)));
    else if (extensions.has(path.extname(entry.name))) files.push(target);
  }

  return files;
}

const files = (await Promise.all(scanRoots.map(walk))).flat();

const checks = [
  {
    label: 'placeholder link href="#"',
    pattern: /href\s*=\s*["']#["']/g,
  },
  {
    label: "raw bracket placeholder",
    pattern: /\[\[[^\]]+\]\]/g,
  },
  {
    label: "private key",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
  {
    label: "probable API secret",
    pattern: /\b(?:sk|rk|re)_[A-Za-z0-9_-]{24,}\b/g,
  },
  {
    label: "probable AWS access key",
    pattern: /\bAKIA[A-Z0-9]{16}\b/g,
  },
  {
    label: "public static profile export variable",
    pattern: /NEXT_PUBLIC_STATIC_PLAYER_USERNAMES/g,
  },
  {
    label: "known personal profile fixture",
    pattern: /\bAugusto\b/g,
  },
];

for (const file of files) {
  const content = await readFile(file, "utf8");

  for (const check of checks) {
    const matches = content.match(check.pattern);
    if (matches?.length) {
      failures.push(
        `${path.relative(root, file)}: ${check.label} (${matches.length})`,
      );
    }
  }
}

const localizationChecks = [
  ["src/lib/locales.ts", 'publicLocales = ["pt-BR", "en", "es"]'],
  ["src/content/site.ts", 'language: "Idioma"'],
  ["src/content/pages.ts", "  es: {"],
];

for (const [relative, expected] of localizationChecks) {
  const content = await readFile(path.join(root, relative), "utf8");
  if (!content.includes(expected)) {
    failures.push(`${relative}: missing Spanish localization marker: ${expected}`);
  }
}

const publicContentFiles = [
  "src/content/site.ts",
  "src/content/pages.ts",
  "src/components/site/ModernHomePage.tsx",
  "src/components/site/LocalizedFooter.tsx",
  "src/components/site/LocalizedContentPage.tsx",
  "src/components/site/LegalPageShell.tsx",
];
const internalStatusLanguage = /\b(?:draft|pending|under validation|in development|planned|roadmap|placeholder|future)\b|rascunho|pendente|em validação|em desenvolvimento|planejado|disponível futuramente|espaço reservado|arte futura|captura final|decisão do responsável|en validación|en desarrollo|planificado/giu;

for (const relative of publicContentFiles) {
  const content = await readFile(path.join(root, relative), "utf8");
  const matches = content.match(internalStatusLanguage);
  if (matches?.length) {
    failures.push(`${relative}: public engineering-status language (${matches.join(", ")})`);
  }
}

if (failures.length) {
  console.error("Content validation failed:\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`Content validation passed across ${files.length} source files.`);
