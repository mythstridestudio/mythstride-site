import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();

// Node strips the types on import, so the helper is exercised directly rather
// than asserted against as source text.
const { parseApiDate } = await import(
  pathToFileURL(path.join(root, "src/lib/dates.ts")).href
);

const formatted = (value, locale = "pt-BR") => {
  const date = parseApiDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

test("a calendar date keeps the day the API named, in any timezone", () => {
  const date = parseApiDate("2026-09-18");

  assert.ok(date instanceof Date);
  // Read back in local time, because a calendar date is local midnight by
  // construction. Parsing it as an instant would show the 17th west of UTC.
  assert.equal(date.getFullYear(), 2026);
  assert.equal(date.getMonth(), 8);
  assert.equal(date.getDate(), 18);
});

test("a full ISO timestamp with milliseconds is a valid instant", () => {
  const date = parseApiDate("2026-09-18T00:00:00.000Z");

  assert.ok(date instanceof Date);
  assert.equal(date.toISOString(), "2026-09-18T00:00:00.000Z");
  assert.notEqual(formatted("2026-09-18T00:00:00.000Z"), "");
});

test("a full ISO timestamp without milliseconds is a valid instant", () => {
  const date = parseApiDate("2026-09-18T15:30:00Z");

  assert.ok(date instanceof Date);
  assert.equal(date.toISOString(), "2026-09-18T15:30:00.000Z");
  assert.notEqual(formatted("2026-09-18T15:30:00Z"), "");
});

test("the shape that used to crash the dashboard no longer can", () => {
  // The old code built `${value}T00:00:00`, so this became
  // `2026-09-18T00:00:00.000ZT00:00:00` -> Invalid Date -> RangeError.
  for (const value of ["2026-09-18T00:00:00.000Z", "2026-09-18T15:30:00Z", "2026-09-18T12:00:00-03:00"]) {
    assert.doesNotThrow(() => formatted(value), value);
    assert.notEqual(formatted(value), "", value);
    assert.doesNotMatch(formatted(value), /invalid/i, value);
  }
});

test("garbage never throws and never renders Invalid Date", () => {
  for (const value of ["not-a-date", "18/09/2026", "2026-13-45", "2026-02-30", "T00:00:00"]) {
    assert.equal(parseApiDate(value), null, value);
    assert.doesNotThrow(() => formatted(value), value);
    assert.equal(formatted(value), "", value);
  }
});

test("absent values fall back instead of failing", () => {
  for (const value of [null, undefined, "", "   "]) {
    assert.equal(parseApiDate(value), null, String(value));
    assert.doesNotThrow(() => formatted(value), String(value));
    assert.equal(formatted(value), "", String(value));
  }
});

// Both screens that render an API date go through the shared parser. The
// concatenation below is the exact shape that crashed the dashboard, so it is
// asserted against by hand: a second copy of it is how this bug spread.
test("every screen formats API dates through the shared parser", async () => {
  const screens = [
    "src/app/(internal)/dashboard/dashboard-shell.tsx",
    "src/app/(internal)/player/[username]/public-player-profile-page.tsx",
  ];

  for (const relative of screens) {
    const source = await readFile(path.join(root, relative), "utf8");

    assert.match(source, /import \{ parseApiDate \} from "@\/lib\/dates"/, relative);
    assert.match(source, /const date = parseApiDate\(value\)/, relative);
    assert.doesNotMatch(source, /new Date\(`\$\{value\}T00:00:00`\)/, relative);
  }
});

test("no source file builds a date by appending a time to a string", async () => {
  async function walk(directory) {
    const files = [];
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) files.push(...(await walk(target)));
      else if (/\.tsx?$/.test(entry.name)) files.push(target);
    }
    return files;
  }

  const parser = path.join(root, "src", "lib", "dates.ts");

  for (const file of await walk(path.join(root, "src"))) {
    // The parser's own header documents the broken shape on purpose.
    if (file === parser) continue;
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(
      source,
      /new Date\(`[^`]*T00:00:00`\)/,
      path.relative(root, file),
    );
  }
});
