
import {Vec2} from "../../core/vec2.js"
import {clamp} from "../../core/basics.js"
import {Rect} from "../../shapes/2d/rect.js"
import {collide2d} from "./collide2d.barrel.js"
import {Circle} from "../../shapes/2d/circle.js"

export class Intersection {
	constructor(
		public contactPoint: Vec2,
		public depth: number,
		public normalA: Vec2,
		public normalB: Vec2,
	) {}
}

export function rectVsRect(a: Rect, b: Rect) {
	if (!collide2d.rectVsRect(a, b)) return null

	const overlapX = Math.min(a.max.x - b.min.x, b.max.x - a.min.x)
	const overlapY = Math.min(a.max.y - b.min.y, b.max.y - a.min.y)
	const depth = Math.min(overlapX, overlapY)

	const aCenter = a.center()
	const bCenter = b.center()

	const contactPoint = Vec2
		.average(aCenter, bCenter)
		.clamp(a.min, a.max)

	const normalA = depth === overlapX
		? new Vec2(bCenter.x > aCenter.x ? -1 : 1, 0)
		: new Vec2(0, bCenter.y > aCenter.y ? -1 : 1)

	const normalB = normalA.dup().mulBy(-1)

	return new Intersection(contactPoint, depth, normalA, normalB)
}

export function rectVsCircle(rect: Rect, circle: Circle) {
	if (!collide2d.rectVsCircle(rect, circle)) return null

	const clamped = new Vec2(
		clamp(circle.center.x, rect.min.x, rect.max.x),
		clamp(circle.center.y, rect.min.y, rect.max.y),
	)
	const difference = circle.center.dup().sub(clamped)
	const distance = difference.magnitude()
	const depth = circle.radius - distance

	const contactPoint = clamped
	const normalA = difference.normalize()
	const normalB = normalA.dup().mulBy(-1)

	return new Intersection(contactPoint, depth, normalA, normalB)
}

export function circleVsCircle(a: Circle, b: Circle) {
	const dx = b.center.x - a.center.x
	const dy = b.center.y - a.center.y
	const distance = Math.sqrt(dx ** 2 + dy ** 2)
	if (distance >= a.radius + b.radius) return null

	const depth = Math.max(0, a.radius + b.radius - distance)

	const normalA = distance === 0
		? new Vec2(1, 0) // fallback for perfectly overlapping circles
		: new Vec2(dx / distance, dy / distance)

	const normalB = normalA.dup().mulBy(-1)

	const contactPoint = new Vec2(
		(a.center.x + b.center.x) / 2,
		(a.center.y + b.center.y) / 2
	)

	return new Intersection(contactPoint, depth, normalA, normalB)
}

