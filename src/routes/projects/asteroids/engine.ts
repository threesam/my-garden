import type {
	Asteroid,
	Bullet,
	EngineOptions,
	GameState,
	InputState,
	Renderer,
	Ship,
	SizeCategory,
	Vec2,
} from './types'

function rand(seed: number) {
	let s = seed >>> 0
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0
		return s / 0xffffffff
	}
}

function wrapPosition(p: Vec2, w: number, h: number): Vec2 {
	let x = p.x
	let y = p.y
	if (x < 0) x += w
	if (x >= w) x -= w
	if (y < 0) y += h
	if (y >= h) y -= h
	return { x, y }
}

function magnitude(v: Vec2): number {
	return Math.hypot(v.x, v.y)
}

function add(a: Vec2, b: Vec2): Vec2 {
	return { x: a.x + b.x, y: a.y + b.y }
}

function scale(v: Vec2, s: number): Vec2 {
	return { x: v.x * s, y: v.y * s }
}

function asteroidRadius(size: SizeCategory): number {
	switch (size) {
		case 'large':
			return 48
		case 'medium':
			return 28
		case 'small':
			return 16
	}
}

function makeAsteroidShape(
	points = 10,
	roughness = 0.5,
	rndFn: () => number = Math.random,
): number[] {
	const arr: number[] = []
	for (let i = 0; i < points; i++) {
		const jitter = 1 - roughness + rndFn() * roughness * 2 // in [1-roughness, 1+roughness]
		arr.push(jitter)
	}
	return arr
}

function splitAsteroid(a: Asteroid): Asteroid[] {
	if (a.size === 'large') {
		return [
			{
				...a,
				size: 'medium',
				radius: asteroidRadius('medium'),
				shape: makeAsteroidShape(10, 0.5, Math.random),
				velocity: { x: -a.velocity.y, y: a.velocity.x },
			},
			{
				...a,
				size: 'medium',
				radius: asteroidRadius('medium'),
				shape: makeAsteroidShape(10, 0.5, Math.random),
				velocity: { x: a.velocity.y, y: -a.velocity.x },
			},
		]
	}
	if (a.size === 'medium') {
		return [
			{
				...a,
				size: 'small',
				radius: asteroidRadius('small'),
				shape: makeAsteroidShape(10, 0.5, Math.random),
				velocity: { x: -a.velocity.y, y: a.velocity.x },
			},
			{
				...a,
				size: 'small',
				radius: asteroidRadius('small'),
				shape: makeAsteroidShape(10, 0.5, Math.random),
				velocity: { x: a.velocity.y, y: -a.velocity.x },
			},
		]
	}
	return []
}

export function createEngine(opts: EngineOptions) {
	const rnd = rand(opts.seed ?? 123456789)
	const renderer: Renderer = opts.renderer

	const state: GameState = {
		width: 800,
		height: 600,
		ship: {
			position: { x: 400, y: 300 },
			velocity: { x: 0, y: 0 },
			angle: -Math.PI / 2,
			rotationSpeed: 0,
			thrusting: false,
			invincibleUntil: 0,
			radius: 14,
		},
		asteroids: [],
		bullets: [],
		score: 0,
		level: opts.initialLevel ?? 1,
		lives: 3,
		gameOver: false,
		lastShotAt: 0,
	}

	function spawnLevel(level: number) {
		state.asteroids = []
		const num = Math.min(4 + level, 12)
		for (let i = 0; i < num; i++) {
			const edge = Math.floor(rnd() * 4)
			const pos: Vec2 =
				edge === 0
					? { x: rnd() * state.width, y: 0 }
					: edge === 1
						? { x: state.width, y: rnd() * state.height }
						: edge === 2
							? { x: rnd() * state.width, y: state.height }
							: { x: 0, y: rnd() * state.height }
			const vel = { x: (rnd() - 0.5) * 80, y: (rnd() - 0.5) * 80 }
			const angle = rnd() * Math.PI * 2
			const spin = (rnd() - 0.5) * 1.2
			state.asteroids.push({
				position: pos,
				velocity: vel,
				angle,
				spin,
				size: 'large',
				radius: asteroidRadius('large'),
				shape: makeAsteroidShape(12, 0.6, rnd),
			})
		}
	}

	function resetShip() {
		state.ship.position = { x: state.width / 2, y: state.height / 2 }
		state.ship.velocity = { x: 0, y: 0 }
		state.ship.angle = -Math.PI / 2
		state.ship.invincibleUntil = performance.now() + 2000
	}

	function updateShip(input: InputState, dt: number) {
		const ship = state.ship
		const ROT_SPEED = 3.5
		const THRUST = 220
		const FRICTION = 0.992
		if (input.left) ship.angle -= ROT_SPEED * dt
		if (input.right) ship.angle += ROT_SPEED * dt
		if (input.up) {
			ship.velocity = add(ship.velocity, {
				x: Math.cos(ship.angle) * THRUST * dt,
				y: Math.sin(ship.angle) * THRUST * dt,
			})
			ship.thrusting = true
		} else {
			ship.thrusting = false
		}
		ship.velocity = scale(ship.velocity, FRICTION)
		ship.position = wrapPosition(
			add(ship.position, scale(ship.velocity, dt)),
			state.width,
			state.height,
		)
	}

	function shoot(now: number) {
		const COOLDOWN = 150
		if (now - state.lastShotAt < COOLDOWN) return
		state.lastShotAt = now
		const dir = { x: Math.cos(state.ship.angle), y: Math.sin(state.ship.angle) }
		const bullet: Bullet = {
			position: {
				x: state.ship.position.x + dir.x * state.ship.radius,
				y: state.ship.position.y + dir.y * state.ship.radius,
			},
			velocity: {
				x: dir.x * 480 + state.ship.velocity.x,
				y: dir.y * 480 + state.ship.velocity.y,
			},
			life: 1.2,
			radius: 2,
		}
		state.bullets.push(bullet)
	}

	function updateBullets(dt: number) {
		state.bullets.forEach((b) => {
			b.life -= dt
			b.position = wrapPosition(
				add(b.position, scale(b.velocity, dt)),
				state.width,
				state.height,
			)
		})
		state.bullets = state.bullets.filter((b) => b.life > 0)
	}

	function updateAsteroids(dt: number) {
		state.asteroids.forEach((a) => {
			a.angle += a.spin * dt
			a.position = wrapPosition(
				add(a.position, scale(a.velocity, dt)),
				state.width,
				state.height,
			)
		})
	}

	function collide() {
		// bullets vs asteroids
		for (let i = state.asteroids.length - 1; i >= 0; i--) {
			const a = state.asteroids[i]
			for (let j = state.bullets.length - 1; j >= 0; j--) {
				const b = state.bullets[j]
				const dx = a.position.x - b.position.x
				const dy = a.position.y - b.position.y
				if (Math.hypot(dx, dy) < a.radius + b.radius) {
					state.bullets.splice(j, 1)
					state.asteroids.splice(i, 1)
					state.score += a.size === 'large' ? 20 : a.size === 'medium' ? 50 : 100
					state.asteroids.push(...splitAsteroid(a))
					break
				}
			}
		}

		// ship vs asteroids
		if (performance.now() > state.ship.invincibleUntil) {
			for (const a of state.asteroids) {
				const dx = a.position.x - state.ship.position.x
				const dy = a.position.y - state.ship.position.y
				if (Math.hypot(dx, dy) < a.radius + state.ship.radius) {
					state.lives -= 1
					if (state.lives <= 0) {
						state.gameOver = true
					} else {
						resetShip()
					}
					break
				}
			}
		}
	}

	function maybeAdvanceLevel() {
		if (state.asteroids.length === 0) {
			state.level += 1
			spawnLevel(state.level)
			resetShip()
		}
	}

	function resize(width: number, height: number) {
		state.width = width
		state.height = height
	}

	function update(input: InputState, dt: number) {
		if (state.gameOver) return
		updateShip(input, dt)
		updateBullets(dt)
		updateAsteroids(dt)
		collide()
		maybeAdvanceLevel()
	}

	function render(ctx: CanvasRenderingContext2D) {
		renderer.clear(ctx, state)
		for (const a of state.asteroids) renderer.renderAsteroid(ctx, a, state)
		for (const b of state.bullets) renderer.renderBullet(ctx, b, state)
		renderer.renderShip(ctx, state.ship, state)
		renderer.renderHUD(ctx, state)
	}

	// init
	spawnLevel(state.level)
	resetShip()

	return {
		state,
		resize,
		shoot,
		update,
		render,
	}
}
