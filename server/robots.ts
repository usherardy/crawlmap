import axios from 'axios'

interface RobotsRules {
  disallowed: string[]
}

export async function fetchRobotsRules(origin: string): Promise<RobotsRules> {
  try {
    const url = `${origin}/robots.txt`
    const res = await axios.get<string>(url, {
      timeout: 5000,
      responseType: 'text',
      headers: { 'User-Agent': 'CrawlMap/1.0 (+https://crawlmap.dev/bot)' },
    })

    const disallowed: string[] = []
    let inRelevantBlock = false

    for (const rawLine of res.data.split('\n')) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue

      if (/^user-agent:/i.test(line)) {
        const agent = line.replace(/^user-agent:\s*/i, '').trim()
        inRelevantBlock = agent === '*'
        continue
      }

      if (inRelevantBlock && /^disallow:/i.test(line)) {
        const path = line.replace(/^disallow:\s*/i, '').trim()
        if (path) disallowed.push(path)
      }
    }

    return { disallowed }
  } catch {
    // Robots.txt not found or unreadable — allow everything
    return { disallowed: [] }
  }
}

export function isDisallowed(path: string, rules: RobotsRules): boolean {
  return rules.disallowed.some((pattern) => {
    if (pattern === '/') return true
    return path.startsWith(pattern)
  })
}
