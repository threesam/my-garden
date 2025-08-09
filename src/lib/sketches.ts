export interface SketchConfig {
  width: number
  height: number
  cellSize: number
  fps: number
}

export interface SketchContext {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  config: SketchConfig
  isRunning: boolean
  animationId: number | null
}

export interface SketchData {
  type: 'cellular-automata'
  config: {
    fps: number
    cellSize: number
  }
  content: {
    overlayText: string
    overlaySubtext: string
    tooltipContent: string
  }
}

export class CellularAutomataSketch {
  private grid: Uint8Array
  private nextGrid: Uint8Array
  private context: SketchContext
  private lastFrameTime: number = 0
  private frameInterval: number

  // Performance optimizations
  private isDirty: boolean = true

  constructor(canvas: HTMLCanvasElement, config: SketchConfig) {
    this.context = {
      canvas,
      ctx: canvas.getContext('2d', {alpha: false})!, // Optimize for performance
      config,
      isRunning: false,
      animationId: null,
    }

    this.grid = new Uint8Array(config.width * config.height)
    this.nextGrid = new Uint8Array(config.width * config.height)
    this.frameInterval = 1000 / config.fps // Dynamic fps

    this.initialize()
  }

  private initialize(): void {
    this.randomize()
    this.resize()
  }

  private idx(x: number, y: number): number {
    return y * this.context.config.width + x
  }

  private randomize(): void {
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = Math.random() > 0.7 ? 1 : 0
    }
    this.isDirty = true
  }

  private countNeighbors(x: number, y: number): number {
    let count = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue

        const nx = (x + dx + this.context.config.width) % this.context.config.width
        const ny = (y + dy + this.context.config.height) % this.context.config.height
        count += this.grid[this.idx(nx, ny)] || 0
      }
    }
    return count
  }

  private step(): void {
    for (let y = 0; y < this.context.config.height; y++) {
      for (let x = 0; x < this.context.config.width; x++) {
        const neighbors = this.countNeighbors(x, y)
        const current = this.grid[this.idx(x, y)]

        // Conway's Game of Life rules
        if (current === 1) {
          this.nextGrid[this.idx(x, y)] = neighbors === 2 || neighbors === 3 ? 1 : 0
        } else {
          this.nextGrid[this.idx(x, y)] = neighbors === 3 ? 1 : 0
        }
      }
    }

    // Swap grids
    ;[this.grid, this.nextGrid] = [this.nextGrid, this.grid]
    this.isDirty = true
  }

  private draw(): void {
    const {ctx, config} = this.context

    // Only redraw if something changed
    if (!this.isDirty) return

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, config.width * config.cellSize, config.height * config.cellSize)

    // Draw grid lines (very light gray) - only if cell size is large enough
    if (config.cellSize >= 4) {
      ctx.strokeStyle = '#f8f9fa'
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x <= config.width; x++) {
        ctx.beginPath()
        ctx.moveTo(x * config.cellSize, 0)
        ctx.lineTo(x * config.cellSize, config.height * config.cellSize)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y <= config.height; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * config.cellSize)
        ctx.lineTo(config.width * config.cellSize, y * config.cellSize)
        ctx.stroke()
      }
    }

    // Calculate center of the grid
    const centerX = config.width / 2
    const centerY = config.height / 2
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)

    // Draw cells with darkness based on distance from center
    for (let y = 0; y < config.height; y++) {
      for (let x = 0; x < config.width; x++) {
        if (this.grid[this.idx(x, y)] === 1) {
          // Calculate distance from center
          const distanceX = Math.abs(x - centerX)
          const distanceY = Math.abs(y - centerY)
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

          // Map distance to darkness (0 = black, 1 = white) - reversed
          const darknessRatio = Math.min(distance / maxDistance - 0.13, 1)

          // Convert to grayscale color (255 = white, 0 = black) - reversed
          const grayValue = Math.round((1 - darknessRatio) * 255)
          const color = `rgb(${grayValue}, ${grayValue}, ${grayValue})`

          ctx.fillStyle = color
          ctx.fillRect(
            x * config.cellSize + 1,
            y * config.cellSize + 1,
            config.cellSize - 2,
            config.cellSize - 2,
          )
        }
      }
    }

    this.isDirty = false
  }

  private animate = (currentTime: number): void => {
    if (!this.context.isRunning) return

    // Throttle to configured fps
    if (currentTime - this.lastFrameTime >= this.frameInterval) {
      this.step()
      this.draw()
      this.lastFrameTime = currentTime
    }

    this.context.animationId = requestAnimationFrame(this.animate)
  }

  public start(): void {
    if (this.context.isRunning) return
    this.context.isRunning = true
    this.lastFrameTime = 0
    this.context.animationId = requestAnimationFrame(this.animate)
  }

  public stop(): void {
    this.context.isRunning = false
    if (this.context.animationId) {
      cancelAnimationFrame(this.context.animationId)
      this.context.animationId = null
    }
  }

  public resize(): void {
    const {canvas, config} = this.context
    canvas.width = config.width * config.cellSize
    canvas.height = config.height * config.cellSize
    this.isDirty = true
  }

  public destroy(): void {
    this.stop()
    // Clean up memory
    this.grid = null as any
    this.nextGrid = null as any
  }
}

export function createCellularAutomataSketch(
  canvas: HTMLCanvasElement,
  data: SketchData,
): CellularAutomataSketch {
  // Get the actual canvas dimensions
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height

  // Use configured cell size or default
  const cellSize = data.config.cellSize || 8
  const maxWidth = Math.floor(canvasWidth / cellSize)
  const maxHeight = Math.floor(canvasHeight / cellSize)

  // Use a reasonable grid size that fits the canvas
  const width = Math.min(200, maxWidth)
  const height = Math.min(120, maxHeight)

  const config: SketchConfig = {
    width,
    height,
    cellSize,
    fps: data.config.fps || 30,
  }

  return new CellularAutomataSketch(canvas, config)
}

// Predefined sketch data
export const SKETCH_DATA: SketchData = {
  type: 'cellular-automata',
  config: {
    fps: 30, // Can be manually changed here
    cellSize: 7,
  },
  content: {
    overlayText: 'Digital Garden',
    overlaySubtext: 'Thoughts, projects, and notes. Built with SvelteKit, Tailwind, and Sanity.',
    tooltipContent:
      "The sketch above demonstrates Conway's Game of Life, a cellular automaton that runs at 30fps. It automatically starts when it comes into view and stops when it's out of view.",
  },
}
