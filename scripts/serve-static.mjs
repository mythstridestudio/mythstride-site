import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const root = path.resolve(process.cwd(), "out");
const port = Number(process.env.PORT ?? 4173);
const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  let target = path.resolve(root, relative || "index.html");

  if (!target.startsWith(root + path.sep) && target !== root) {
    response.writeHead(400).end("Invalid path");
    return;
  }

  try {
    const details = await stat(target);
    if (details.isDirectory()) target = path.join(target, "index.html");
  } catch {
    if (!path.extname(target)) target = path.join(target, "index.html");
  }

  try {
    const details = await stat(target);
    if (!details.isFile()) throw new Error("Not a file");
  } catch {
    target = path.join(root, "404.html");
    response.statusCode = 404;
  }

  response.setHeader(
    "Content-Type",
    mime[path.extname(target).toLowerCase()] ?? "application/octet-stream",
  );
  createReadStream(target).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Static export available at http://127.0.0.1:${port}`);
});
