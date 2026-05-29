import { useMemo } from 'react'
import { Network, GitBranch, Table2 } from 'lucide-react'
import { useCrawler } from '@/hooks/useCrawler'
import { buildFlowNodes, buildFlowEdges } from '@/utils/graphHelpers'
import { TopBar } from '@/components/dashboard/TopBar'
import { SettingsPanel } from '@/components/dashboard/SettingsPanel'
import { DetailsPanel } from '@/components/dashboard/DetailsPanel'
import { ExportToolbar } from '@/components/dashboard/ExportToolbar'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { LoadingState } from '@/components/dashboard/LoadingState'
import { ErrorState } from '@/components/dashboard/ErrorState'
import { CrawlProgressBanner } from '@/components/dashboard/CrawlProgressBanner'
import { GraphCanvas } from '@/components/dashboard/graph/GraphCanvas'
import { TreeView } from '@/components/dashboard/tree/TreeView'
import { TableView } from '@/components/dashboard/table/TableView'
import { Tabs } from '@/components/ui/Tabs'

const VIEW_TABS = [
  { id: 'graph', label: 'Graph', icon: <Network className="w-3.5 h-3.5" /> },
  { id: 'tree', label: 'Tree', icon: <GitBranch className="w-3.5 h-3.5" /> },
  { id: 'table', label: 'Table', icon: <Table2 className="w-3.5 h-3.5" /> },
]

export function DashboardPage() {
  const {
    status,
    pages,
    selectedPage,
    currentPath,
    pagesFound,
    options,
    viewMode,
    layoutDirection,
    crawlUrl,
    error,
    startCrawl,
    stopCrawl,
    loadExample,
    resetCrawl,
    selectPage,
    setOptions,
    setViewMode,
    setLayoutDirection,
  } = useCrawler()

  const flowNodes = useMemo(() => buildFlowNodes(pages), [pages])
  const flowEdges = useMemo(() => buildFlowEdges(pages), [pages])
  const deadCount = useMemo(
    () => pages.filter((p) => p.statusCode !== null && p.statusCode >= 400).length,
    [pages]
  )

  const handleNodeClick = (nodeId: string) => {
    const page = pages.find((p) => p.id === nodeId) ?? null
    selectPage(page)
  }

  const handlePaneClick = () => selectPage(null)
  const handleTreeSelect = (page: typeof pages[0]) => selectPage(page)
  const handleTableSelect = (page: typeof pages[0]) => selectPage(page)

  const hasPages = pages.length > 0
  const isCrawling = status === 'crawling'

  return (
    <div className="flex flex-col h-screen bg-base overflow-hidden">
      <TopBar
        url={options.url}
        onUrlChange={(url) => setOptions({ url })}
        onCrawl={() => startCrawl()}
        onStop={stopCrawl}
        onReset={resetCrawl}
        status={status}
        pageCount={pages.length}
        deadCount={deadCount}
      />

      <div className="flex flex-1 overflow-hidden">
        <SettingsPanel
          options={options}
          onChange={setOptions}
          disabled={isCrawling}
        />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* View tab bar — visible as soon as any pages arrive */}
          {hasPages && (
            <div className="flex items-center gap-3 px-4 py-2 border-b border-white/6 flex-shrink-0">
              <Tabs
                tabs={VIEW_TABS.map((t) => ({
                  ...t,
                  count: t.id === 'table' ? pages.length : undefined,
                }))}
                activeTab={viewMode}
                onChange={(id) => setViewMode(id as typeof viewMode)}
                size="sm"
              />
            </div>
          )}

          {/* Live crawl progress banner — slim bar above the graph while crawling */}
          {isCrawling && hasPages && (
            <CrawlProgressBanner
              pagesFound={pagesFound}
              currentPath={currentPath}
              onStop={stopCrawl}
            />
          )}

          {/* Content area */}
          <div className="flex-1 overflow-hidden relative">
            {/* Empty: nothing crawled yet */}
            {status === 'idle' && !hasPages && (
              <EmptyState onLoadExample={loadExample} />
            )}

            {/* Full-screen spinner: waiting for first page to arrive */}
            {isCrawling && !hasPages && (
              <LoadingState
                url={crawlUrl}
                pagesFound={pagesFound}
                currentPath={currentPath}
              />
            )}

            {/* Error state */}
            {status === 'error' && (
              <ErrorState message={error} onRetry={resetCrawl} />
            )}

            {/* Graph — shows as soon as pages arrive, stays through crawling and completion */}
            {hasPages && viewMode === 'graph' && (
              <GraphCanvas
                rawNodes={flowNodes}
                rawEdges={flowEdges}
                selectedNodeId={selectedPage?.id ?? null}
                layoutDirection={layoutDirection}
                onNodeClick={handleNodeClick}
                onPaneClick={handlePaneClick}
                onDirectionChange={setLayoutDirection}
              />
            )}

            {hasPages && viewMode === 'tree' && (
              <TreeView
                pages={pages}
                selectedId={selectedPage?.id ?? null}
                onSelect={handleTreeSelect}
              />
            )}

            {hasPages && viewMode === 'table' && (
              <TableView
                pages={pages}
                selectedId={selectedPage?.id ?? null}
                onSelect={handleTableSelect}
              />
            )}
          </div>
        </main>

        <DetailsPanel
          page={selectedPage}
          onClose={() => selectPage(null)}
        />
      </div>

      <ExportToolbar
        pages={pages}
        rootUrl={crawlUrl || options.url}
        disabled={isCrawling || !hasPages}
      />
    </div>
  )
}
