
import {wrap} from "./basics.js"

export const circle = 2 * Math.PI

export function circularNormalize(x: number) {
	return wrap(x, 0, circle)
}

export function circularDelta(from: number, to: number) {
	let delta = circularNormalize(to) - circularNormalize(from)
	if (delta > Math.PI) delta -= circle
	if (delta < -Math.PI) delta += circle
	return delta
}

export function circularDistance(a: number, b: number) {
	return Math.abs(circularDelta(a, b))
}

export function circularApproach(step: number, from: number, to: number) {
	const delta = circularDelta(from, to)
	return (Math.abs(delta) <= step)
		? to
		: circularNormalize(from + Math.sign(delta) * step)
}

export function circularLerp(fraction: number, x: number, y: number, max?: number) {
	const difference = circularDelta(x, y)
	let delta = difference * fraction
	if (max !== undefined && Math.abs(delta) > max)
		delta = Math.sign(delta) * max
	return circularNormalize(x + delta)
}

