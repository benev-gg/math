
import {clamp} from "../../core/basics.js"
import {Vec2, Xy} from "../../core/vec2.js"
import {RectLike} from "../../shapes/2d/rect.js"
import {CircleLike} from "../../shapes/2d/circle.js"

export function pointVsRect(point: Xy, box: RectLike) {
	const {min, max} = box
	return (
		point.x >= min.x &&
		point.x <= max.x &&
		point.y >= min.y &&
		point.y <= max.y
	)
}

export function pointVsCircle(point: Xy, circle: CircleLike) {
	const dx = point.x - circle.center.x
	const dy = point.y - circle.center.y
	const distanceSquared = (dx ** 2) + (dy ** 2)
	return distanceSquared <= (circle.radius ** 2)
}

export function rectVsRect(a: RectLike, b: RectLike) {
	return !(
		a.max.x <= b.min.x ||
		a.min.x >= b.max.x ||
		a.max.y <= b.min.y ||
		a.min.y >= b.max.y
	)
}

export function rectVsCircle(rect: RectLike, circle: CircleLike) {
	const clamped = new Vec2(
		clamp(circle.center.x, rect.min.x, rect.max.x),
		clamp(circle.center.y, rect.min.y, rect.max.y),
	)
	const difference = Vec2.from(circle.center).sub(clamped)
	const distanceSquared = (difference.x ** 2) + (difference.y ** 2)
	const radiusSquared = circle.radius ** 2
	return distanceSquared <= radiusSquared
}

export function circleVsCircle(circleA: CircleLike, circleB: CircleLike) {
	const dx = circleB.center.x - circleA.center.x
	const dy = circleB.center.y - circleA.center.y
	const distanceSquared = (dx ** 2) + (dy ** 2)
	const radiusSum = circleA.radius + circleB.radius
	return distanceSquared <= (radiusSum ** 2)
}

