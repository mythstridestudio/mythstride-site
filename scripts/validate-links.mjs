import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");
const failures = [];

async function collectHtml(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectHtml(target)));
    else if (entry.name.endsWith(".html")) files.push(target);
  }
  return files;
}

async function artifactFor(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const clean = decoded.replace(/^\/+/, "");
  if (!clean) return path.join(out, "index.html");
  if (path.extname(clean)) return path.join(out, clean);
  return path.join(out, clean, "index.html");
}

async function canRead(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

for (const htmlFile of await collectHtml(out)) {
  const html = await readFile(htmlFile, "utf8");
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  const relativeHtmlPath = path.relative(out, htmlFile).replaceAll("\\", "/");
  const currentRoute =
    relativeHtmlPath === "index.html"
      ? "/"
      : `/${relativeHtmlPath.replace(/index\.html$/, "")}`;
  const pageUrl = new URL(currentRoute, "https://playmythstride.com");

  for (const href of new Set(hrefs)) {
    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      continue;
    }

    const parsed = new URL(href, pageUrl);
    const target = await artifactFor(parsed.pathname);

    if (!(await canRead(target))) {
      failures.push(
        `${path.relative(out, htmlFile)} -> missing ${parsed.pathname}`,
      );
      continue;
    }

    if (parsed.hash && target.endsWith(".html")) {
      const targetHtml = await readFile(target, "utf8");
      const id = parsed.hash.slice(1);
      if (!targetHtml.includes(`id="${id}"`)) {
        failures.push(
          `${path.relative(out, htmlFile)} -> missing anchor ${parsed.pathname}${parsed.hash}`,
        );
      }
    }
  }
}

if (failures.length) {
  console.error("Internal-link validation failed:\n" + failures.join("\n"));
  process.exit(1);
}

console.log("Internal-link validation passed.");
