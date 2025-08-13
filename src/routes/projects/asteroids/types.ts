export type Vec2 = { x: number; y: number }

export type SizeCategory = 'large' | 'medium' | 'small'

export interface Ship {
	position: Vec2
	velocity: Vec2
	angle: number
	rotationSpeed: number
	thrusting: boolean
	invincibleUntil: number
	radius: number
}

export interface Asteroid {
	position: Vec2
	velocity: Vec2
	angle: number
	spin: number
	size: SizeCategory
	radius: number
	// Precomputed radial multipliers for a jagged outline (stable across frames)
	shape: number[]
}

export interface Bullet {
	position: Vec2
	velocity: Vec2
	life: number
	radius: number
}

export interface InputState {
	left: boolean
	right: boolean
	up: boolean
	fire: boolean
}

export interface GameState {
	width: number
	height: number
	ship: Ship
	asteroids: Asteroid[]
	bullets: Bullet[]
	score: number
	level: number
	lives: number
	gameOver: boolean
	lastShotAt: number
}

export interface Renderer {
	clear(ctx: CanvasRenderingContext2D, state: GameState): void
	renderShip(ctx: CanvasRenderingContext2D, ship: Ship, state: GameState): void
	renderAsteroid(ctx: CanvasRenderingContext2D, asteroid: Asteroid, state: GameState): void
	renderBullet(ctx: CanvasRenderingContext2D, bullet: Bullet, state: GameState): void
	renderHUD(ctx: CanvasRenderingContext2D, state: GameState): void
}

export interface EngineOptions {
	seed?: number
	initialLevel?: number
	renderer: Renderer
}
