import { ZoomIn, ZoomOut, Maximize2, ArrowDownUp, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import type { LayoutDirection } from '@/types/graph'

interface GraphControlsProps {
  onFitView: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  direction: LayoutDirection
  onDirectionChange: (dir: LayoutDirection) => void
}

export function GraphControls({
  onFitView,
  onZoomIn,
  onZoomOut,
  direction,
  onDirectionChange,
}: GraphControlsProps) {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 glass rounded-xl p-1 shadow-card">
      <Button variant="ghost" size="icon-sm" onClick={onZoomIn} title="Zoom in">
        <ZoomIn className="w-3.5 h-3.5" />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={onZoomOut} title="Zoom out">
        <ZoomOut className="w-3.5 h-3.5" />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={onFitView} title="Fit view">
        <Maximize2 className="w-3.5 h-3.5" />
      </Button>
      <div className="w-px h-4 bg-white/10 mx-0.5" />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => onDirectionChange(direction === 'TB' ? 'LR' : 'TB')}
        title={direction === 'TB' ? 'Switch to horizontal layout' : 'Switch to vertical layout'}
        className={cn(direction === 'LR' && 'text-accent')}
      >
        {direction === 'TB' ? (
          <ArrowDownUp className="w-3.5 h-3.5" />
        ) : (
          <ArrowLeftRight className="w-3.5 h-3.5" />
        )}
      </Button>
    </div>
  )
}
