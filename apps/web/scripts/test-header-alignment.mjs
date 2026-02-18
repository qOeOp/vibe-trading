/**
 * Diagnostic script: measures header alignment in the factor data table.
 * Serves the static build output and measures DOM positioning via Playwright.
 * Run: node apps/web/scripts/test-header-alignment.mjs
 */
import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

const BUILD_DIR = path.resolve("dist/apps/web/.next");
const PORT = 9234;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json",
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = req.url.split("?")[0];

      // Try exact path, then with .html, then index.html
      const candidates = [
        path.join(BUILD_DIR, urlPath),
        path.join(BUILD_DIR, urlPath + ".html"),
        path.join(BUILD_DIR, urlPath, "index.html"),
      ];

      for (const filePath of candidates) {
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath);
          res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
          fs.createReadStream(filePath).pipe(res);
          return;
        }
      }

      res.writeHead(404);
      res.end("Not found: " + urlPath);
    });

    server.listen(PORT, () => {
      console.log(`Static server at http://localhost:${PORT} (root: ${BUILD_DIR})`);
      resolve(server);
    });
  });
}

async function main() {
  const server = await startServer();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });

  const url = `http://localhost:${PORT}/factor/library`;
  console.log(`Navigating to ${url}...`);

  await page.goto(url, { waitUntil: "load", timeout: 15000 });
  await page.waitForTimeout(5000); // wait for React hydration

  // Check page content
  const pageTitle = await page.title();
  const bodyHTML = await page.evaluate(() => document.body.innerHTML.substring(0, 500));
  console.log(`\nPage title: ${pageTitle}`);
  console.log(`Body preview: ${bodyHTML.substring(0, 200)}...\n`);

  // Get all <th> elements
  const thData = await page.evaluate(() => {
    // Try both selectors
    let ths = Array.from(document.querySelectorAll("th[data-slot='table-head']"));
    if (ths.length === 0) {
      ths = Array.from(document.querySelectorAll("th"));
    }

    if (ths.length === 0) {
      return [{ note: "NO TH ELEMENTS FOUND", html: document.body.innerHTML.substring(0, 1000) }];
    }

    return ths.map((th) => {
      const rect = th.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(th);

      // Walk DOM tree
      const children = Array.from(th.children);
      const childInfo = children.map((child) => {
        const childRect = child.getBoundingClientRect();
        const childStyle = window.getComputedStyle(child);
        return {
          tag: child.tagName,
          display: childStyle.display,
          width: Math.round(childRect.width),
          left: Math.round(childRect.left - rect.left),
          right: Math.round(rect.right - childRect.right),
          className: (child.className || "").substring(0, 80),
        };
      });

      // Find the trigger button
      const trigger = th.querySelector("button");
      const triggerRect = trigger ? trigger.getBoundingClientRect() : null;
      const triggerStyle = trigger ? window.getComputedStyle(trigger) : null;

      return {
        thTextContent: th.textContent?.trim().substring(0, 20),
        thClass: (th.className || "").substring(0, 120),
        thWidth: Math.round(rect.width),
        thTextAlign: computedStyle.textAlign,
        thDisplay: computedStyle.display,
        thOverflow: computedStyle.overflow,
        thPadding: computedStyle.padding,
        children: childInfo,
        triggerDisplay: triggerStyle?.display,
        triggerWidth: triggerRect ? Math.round(triggerRect.width) : null,
        triggerLeft: triggerRect ? Math.round(triggerRect.left - rect.left) : null,
        triggerRight: triggerRect ? Math.round(rect.right - triggerRect.right) : null,
      };
    });
  });

  console.log("=== TH Header Analysis ===\n");
  console.log(`Found ${thData.length} header cells\n`);

  for (const th of thData) {
    if (th.note) {
      console.log(th.note);
      console.log(th.html?.substring(0, 300));
      continue;
    }

    console.log(`--- "${th.thTextContent}" ---`);
    console.log(`  th: ${th.thWidth}px wide, text-align: ${th.thTextAlign}, display: ${th.thDisplay}, overflow: ${th.thOverflow}`);
    console.log(`  th padding: ${th.thPadding}`);
    console.log(`  th class: ${th.thClass}`);

    if (th.children?.length) {
      for (let i = 0; i < th.children.length; i++) {
        const c = th.children[i];
        console.log(`  child[${i}]: <${c.tag}> display=${c.display}, ${c.width}px wide, left-offset=${c.left}px, right-gap=${c.right}px`);
        console.log(`    class: ${c.className}`);
      }
    }

    if (th.triggerDisplay) {
      console.log(`  trigger <button>: display=${th.triggerDisplay}, ${th.triggerWidth}px wide`);
      console.log(`  trigger position: left-offset=${th.triggerLeft}px, right-gap=${th.triggerRight}px`);

      const isRightAligned = th.thTextAlign === "right" || th.thClass?.includes("text-right");
      if (isRightAligned) {
        const ok = th.triggerRight !== null && th.triggerRight <= 5;
        console.log(`  >>> RIGHT-ALIGNED: ${ok ? "✅ trigger at right edge" : `❌ trigger has ${th.triggerRight}px gap from right edge`}`);
      }
    }
    console.log();
  }

  // Take screenshot
  const screenshotPath = path.resolve("apps/web/scripts/header-alignment.png");
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`\nScreenshot saved to ${screenshotPath}`);

  await browser.close();
  server.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
