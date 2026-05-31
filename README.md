# CrawlMap

**Turn any website into a visual sitemap — in seconds.**

CrawlMap discovers every internal page of a website, maps the link structure as an interactive graph, and exports clean data for SEO, development, and AI tools. No account required.

🔗 **Live:** [crawlmap.vercel.app](https://crawlmap.vercel.app)

![CrawlMap Dashboard](https://raw.githubusercontent.com/usherardy/crawlmap/main/docs/preview.png)

---

## What it does

Paste a URL and CrawlMap:

- Crawls every internal page via BFS, respecting `robots.txt`
- Parses `sitemap.xml` first so SPAs and Next.js apps are fully mapped
- Streams discovered pages live as an interactive graph
- Flags dead links (404 / 5xx) with red nodes so you spot broken pages instantly
- Checks external links for status codes when enabled
- Exports the full sitemap in 5 formats: **TXT · CSV · JSON · XML · Markdown**

---

## Features

| | |
|---|---|
| **Live graph** | Force-directed interactive graph with zoom, pan, and node inspection |
| **Sitemap-first** | Reads `sitemap.xml` before crawling — finds all pages on SPAs and JS-heavy sites |
| **Dead link detection** | 404 / 5xx nodes highlighted in red with a warning badge |
| **Real-time streaming** | Pages appear as they're discovered via Server-Sent Events |
| **3 views** | Switch between Graph, Tree, and Table |
| **AI-ready export** | Markdown export structured for pasting directly into ChatGPT, Claude, or Cursor |
| **robots.txt** | Optionally respect crawl directives |
| **CLI-friendly** | All exports are clean text formats — pipe into any toolchain |

---

## Getting started

```bash
git clone https://github.com/usherardy/crawlmap.git
cd crawlmap
npm install
npm run dev
```

Opens at **http://localhost:5173** — the crawler server starts automatically on port 3001.

### Requirements

- Node.js 18+
- npm 9+

---

## CLI usage

Run a crawl directly from your terminal — no browser needed:

```bash
npm run cli -- https://example.com --max-pages 100 --max-depth 3
```

| Option | Default | Description |
|---|---|---|
| `--max-pages <n>` | 100 | Maximum pages to crawl |
| `--max-depth <n>` | 3 | Maximum crawl depth |
| `--no-robots` | — | Ignore robots.txt directives |
| `--external` | — | Include and status-check external links |
| `--output <dir>` | `.` | Directory to write output files |

Writes 5 files to the output directory: `links.txt`, `links.csv`, `sitemap.xml`, `site-structure.json`, and `ai-context.md`.

---

## How it works

```
Browser → EventSource('/api/crawl?url=...')
              ↓ Vite proxy (dev)
         Express :3001
              ↓
         1. Parse sitemap.xml
         2. BFS crawl via Axios + Cheerio
         3. Stream PageNode objects as SSE
              ↓
         React graph (ReactFlow) renders live
```

1. **Sitemap discovery** — fetches `/sitemap.xml` and `/sitemap_index.xml` before BFS starts. Nested sitemap indexes are recursed automatically.
2. **BFS crawl** — visits each page, extracts `<a href>` links, classifies internal vs external, respects depth and page limits.
3. **Dead link detection** — all discovered pages are fetched regardless of status code. 4xx / 5xx pages are emitted as nodes and highlighted red.
4. **External link checking** — when enabled, HEAD-requests all external URLs and emits them as graph nodes with their status code.
5. **SSE streaming** — each `PageNode` is sent to the browser the moment it's discovered, so the graph builds in real time.

---

## Tech stack

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- ReactFlow (`@xyflow/react`)

**Backend**
- Express 5 (local dev server) · Vercel serverless functions (production)
- Local: Axios + Cheerio · Production: native `fetch` + `node-html-parser`
- Server-Sent Events (real-time streaming)
- Commander (CLI)

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend + backend together |
| `npm run dev:client` | Frontend only (Vite, port 5173) |
| `npm run dev:server` | Backend only (Express, port 3001) |
| `npm run cli -- <url>` | Run a crawl from the terminal and export files |
| `npm run build` | Production build |

---

## Export formats

| Format | Use case |
|---|---|
| **TXT** | Plain URL list, one per line |
| **CSV** | Spreadsheet-ready with URL, title, status, depth |
| **JSON** | Full metadata — links, depth, canonical, status codes |
| **XML** | Valid `sitemap.xml` for search engine submission |
| **Markdown** | Structured context for AI tools (ChatGPT, Claude, Cursor) |

---

## License

MIT — free to use, modify, and deploy.
