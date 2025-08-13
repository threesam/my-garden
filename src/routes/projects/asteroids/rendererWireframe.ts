import type { Renderer, GameState, Ship, Asteroid, Bullet } from './types'

function setWireframe(ctx: CanvasRenderingContext2D) {
	ctx.strokeStyle = '#c7c7c7'
	ctx.fillStyle = 'transparent'
	ctx.lineWidth = 1.5
}

function wrapContext(ctx: CanvasRenderingContext2D, width: number, height: number, cb: () => void) {
	ctx.save()
	cb()
	ctx.restore()
}

export const wireframeRenderer: Renderer = {
	clear(ctx: CanvasRenderingContext2D, state: GameState) {
		ctx.fillStyle = '#000'
		ctx.fillRect(0, 0, state.width, state.height)
	},

	renderShip(ctx: CanvasRenderingContext2D, ship: Ship, state: GameState) {
		wrapContext(ctx, state.width, state.height, () => {
			setWireframe(ctx)
			ctx.translate(ship.position.x, ship.position.y)
			ctx.rotate(ship.angle)
			ctx.beginPath()
			ctx.moveTo(ship.radius, 0)
			ctx.lineTo(-ship.radius * 0.8, ship.radius * 0.6)
			ctx.lineTo(-ship.radius * 0.4, 0)
			ctx.lineTo(-ship.radius * 0.8, -ship.radius * 0.6)
			ctx.closePath()
			ctx.stroke()
		})
	},

	renderAsteroid(ctx: CanvasRenderingContext2D, asteroid: Asteroid, state: GameState) {
		wrapContext(ctx, state.width, state.height, () => {
			setWireframe(ctx)
			ctx.translate(asteroid.position.x, asteroid.position.y)
			ctx.rotate(asteroid.angle)
			const r = asteroid.radius
			ctx.beginPath()
			const points = asteroid.shape.length
			for (let i = 0; i < points; i++) {
				const ang = (i / points) * Math.PI * 2
				const mul = asteroid.shape[i]
				const x = Math.cos(ang) * r * mul
				const y = Math.sin(ang) * r * mul
				if (i === 0) ctx.moveTo(x, y)
				else ctx.lineTo(x, y)
			}
			ctx.closePath()
			ctx.stroke()
		})
	},

	renderBullet(ctx: CanvasRenderingContext2D, bullet: Bullet) {
		setWireframe(ctx)
		ctx.beginPath()
		ctx.arc(bullet.position.x, bullet.position.y, bullet.radius, 0, Math.PI * 2)
		ctx.stroke()
	},

	renderHUD(ctx: CanvasRenderingContext2D, state: GameState) {
		ctx.save()
		ctx.fillStyle = '#c7c7c7'
		ctx.font =
			'12px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
		ctx.textBaseline = 'top'
		ctx.fillText(`Score: ${state.score}`, 8, 6)
		ctx.fillText(`Level: ${state.level}`, 100, 6)
		ctx.fillText(`Lives: ${state.lives}`, 175, 6)
		ctx.restore()
	},
}
