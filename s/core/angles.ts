
import {wrap} from "./basics.js"

export const pi = Math.PI
export const circle = 2 * pi

/** convert radians to degrees. */
export function toDegrees(radians: number) {
	return radians * (180 / pi)
}

/** convert radians to arcseconds. */
export function toArcseconds(radians: number) {
	return toDegrees(radians) * 3600
}

/** convert radians to turns. */
export function toTurns(radians: number) {
	return radians / circle
}

/** convert turns to radians. */
export function turns(t: number) {
	return t * circle
}

/** convert arcseconds to radians. */
export function arcseconds(a: number) {
	return degrees(a / 3600)
}

/** convert degrees to radians. */
export function degrees(d: number) {
	return d * (pi / 180)
}

export function angleNormalize(x: number) {
	return wrap(x, 0, circle)
}

export function angleDelta(from: number, to: number) {
	let delta = angleNormalize(to) - angleNormalize(from)
	if (delta > pi) delta -= circle
	if (delta < -pi) delta += circle
	return delta
}

export function angleDistance(a: number, b: number) {
	return Math.abs(angleDelta(a, b))
}

export function angleApproach(step: number, from: number, to: number) {
	const delta = angleDelta(from, to)
	return (Math.abs(delta) <= step)
		? to
		: angleNormalize(from + Math.sign(delta) * step)
}

export function angleLerp(fraction: number, x: number, y: number, max?: number) {
	const difference = angleDelta(x, y)
	let delta = difference * fraction
	if (max !== undefined && Math.abs(delta) > max)
		delta = Math.sign(delta) * max
	return angleNormalize(x + delta)
}

