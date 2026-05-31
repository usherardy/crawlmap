#!/usr/bin/env node
import { Command } from 'commander'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { runCrawl } from './server/crawler.js'
import {
  formatAsTxt,
  formatAsCsv,
  formatAsJson,
  formatAsXml,
  formatAsMarkdown,
} from './src/utils/exportFormatters.js'
import type { PageNode } from './src/types/crawler.js'

// ── ANSI colours ─────────────────────────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  cyan:   '\x1b[36m',
  white:  '\x1b[37m',
}

function statusColor(code: number | null): string {
  if (!code)           return c.dim
  if (code < 300)      return c.green
  if (code < 400)      return c.yellow
  return c.red
}

function arrow(text: string)  { return `${c.cyan}→${c.reset}  ${text}` }
function check(path: string, code: number | null) {
  const col = statusColor(code)
  return `${col}✓${c.reset}  ${c.white}${path}${c.reset} ${col}${code ?? '—'}${c.reset}`
}

// ── Version ───────────────────────────────────────────────────────────────────
const require = createRequire(import.meta.url)
const pkg = require('./package.json') as { version: string }

// ── CLI ───────────────────────────────────────────────────────────────────────
const program = new Command()

program
  .name('crawlmap')
  .description('Turn any website into a visual sitemap.')
  .version(pkg.version)
  .argument('<url>', 'Website URL to crawl')
  .option('--max-pages <n>', 'Maximum pages to crawl', '100')
  .option('--max-depth <n>', 'Maximum crawl depth', '3')
  .option('--no-robots', 'Ignore robots.txt directives')
  .option('--external', 'Include and status-check external links')
  .option('--output <dir>', 'Directory to write output files', '.')
  .action(async (url: string, opts) => {
    // Validate URL
    try { new URL(url) } catch {
      console.error(`${c.red}Error:${c.reset} Invalid URL — ${url}`)
      process.exit(1)
    }

    const maxPages   = Math.max(1, parseInt(opts.maxPages, 10) || 100)
    const maxDepth   = Math.max(1, parseInt(opts.maxDepth, 10) || 3)
    const outputDir  = resolve(opts.output)

    console.log(`\n${c.bold}CrawlMap v${pkg.version}${c.reset} — starting crawl...\n`)

    const pages: PageNode[] = []
    const start = Date.now()

    try {
      await runCrawl(
        { url, maxPages, maxDepth, respectRobots: opts.robots !== false, includeExternal: !!opts.external },
        (page) => {
          pages.push(page)
          process.stdout.write(check(page.path, page.statusCode) + '\n')
        },
        () => false,
      )
    } catch (err) {
      console.error(`\n${c.red}Crawl failed:${c.reset}`, err instanceof Error ? err.message : err)
      process.exit(1)
    }

    const elapsed = ((Date.now() - start) / 1000).toFixed(1)
    console.log(`\n${c.bold}${pages.length} page${pages.length === 1 ? '' : 's'} crawled in ${elapsed}s${c.reset}\n`)

    if (pages.length === 0) {
      console.log(`${c.yellow}No pages found. Try increasing --max-depth or check the URL.${c.reset}`)
      process.exit(0)
    }

    // Ensure output directory exists
    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true })

    const write = (filename: string, content: string, description: string) => {
      const fullPath = join(outputDir, filename)
      writeFileSync(fullPath, content, 'utf8')
      console.log(arrow(`${c.bold}${filename}${c.reset}  ${c.dim}${description}${c.reset}`))
    }

    write('links.txt',          formatAsTxt(pages),          `(${pages.length} URLs)`)
    write('links.csv',          formatAsCsv(pages),          `(CSV with metadata)`)
    write('sitemap.xml',        formatAsXml(pages, url),     `(XML sitemap)`)
    write('site-structure.json',formatAsJson(pages, url),    `(Full metadata)`)
    write('ai-context.md',      formatAsMarkdown(pages, url),`(AI-ready)`)

    if (outputDir !== resolve('.')) {
      console.log(`\n${c.dim}Files written to: ${outputDir}${c.reset}`)
    }

    console.log()
  })

program.parse()
