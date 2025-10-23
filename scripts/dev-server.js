#!/usr/bin/env node
/**
 * Lightweight static file server to mirror `npx serve` without npm registry access.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const args = process.argv.slice(2);
let rootDir = 'public';
let port = 4173;

for (const arg of args) {
  if (arg.startsWith('--port=')) {
    const value = Number(arg.split('=')[1]);
    if (!Number.isNaN(value)) {
      port = value;
    }
  } else if (!arg.startsWith('--')) {
    rootDir = arg;
  }
}

const root = path.resolve(process.cwd(), rootDir);

if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  console.error(`Cannot serve: resolved path "${root}" is not a directory.`);
  process.exit(1);
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8'
};

function send(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(message);
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(requestUrl.pathname);

  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }

  const filePath = path.join(root, pathname);
  if (!filePath.startsWith(root)) {
    send(res, 403, 'Forbidden');
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr) {
      send(res, 404, 'Not found');
      return;
    }

    let finalPath = filePath;
    if (stats.isDirectory()) {
      finalPath = path.join(filePath, 'index.html');
    }

    fs.stat(finalPath, (finalErr, finalStats) => {
      if (finalErr || !finalStats.isFile()) {
        send(res, 404, 'Not found');
        return;
      }

      const ext = path.extname(finalPath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      const stream = fs.createReadStream(finalPath);

      stream.on('open', () => {
        res.writeHead(200, { 'Content-Type': contentType });
        stream.pipe(res);
      });

      stream.on('error', (error) => {
        console.error(error);
        if (!res.headersSent) {
          send(res, 500, 'Internal server error');
        } else {
          res.destroy(error);
        }
      });
    });
  });
});

server.listen(port, () => {
  console.log(`Static server ready on http://localhost:${port} (root: ${root})`);
});
