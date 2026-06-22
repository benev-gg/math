
export const {min, max, abs, sign, floor, ceil, pow} = Math

export function sum(...numbers: number[]) {
	let x = 0
	for (const n of numbers)
		x += n
	return x
}

export function between(x: number, a = 0, b = 1) {
	const small = Math.min(a, b)
	const big = Math.max(a, b)
	return (x >= small) && (x <= big)
}

export function clamp(x: number, a: number = 0, b: number = 1) {
	x = min(x, b)
	x = max(x, a)
	return x
}

export function atLeast(x: number, least = 0) {
	return Math.max(x, least)
}

export function atMost(x: number, most = 1) {
	return Math.min(x, most)
}

export function distance(x: number, y: number) {
	return Math.abs(x - y)
}

export function wrap(x: number, a: number = 0, b: number = 1) {
	const small = min(a, b)
	const big = max(a, b)
	const span = big - small
	const adjusted = x - small
	const wrapped = (adjusted < 0)
		? span - (-adjusted % span)
		: adjusted % span
	return small + wrapped
}

export function lerp(fraction: number, from: number, to: number, maxDelta?: number) {
	const difference = to - from
	let delta = difference * fraction
	if (maxDelta !== undefined && abs(delta) > maxDelta)
		delta = sign(delta) * maxDelta
	return from + delta
}

export function unlerp(x: number, a: number, b: number) {
	return (x - a) / (b - a)
}

export function remap(x: number, a1: number, a2: number, b1: number = 0, b2: number = 1, clamping = false) {
	let fraction = unlerp(x, a1, a2)
	if (clamping) fraction = clamp(fraction)
	return lerp(fraction, b1, b2)
}

/** calculate a time-based lerp factor */
export function halflife(halfTime: number, deltaTime: number) {
	return 1 - pow(0.5, deltaTime / halfTime)
}

export function approach(maxDelta: number, from: number, to: number) {
	const delta = clamp(to - from, -maxDelta, maxDelta)
	return from + delta
}

export function circularNormalize(x: number) {
	return wrap(x, 0, Math.PI * 2)
}

export function circularDelta(from: number, to: number) {
	return Math.atan2(
		Math.sin(to - from),
		Math.cos(to - from),
	)
}

export function circularApproach(maxDelta: number, from: number, to: number) {
	const delta = circularDelta(from, to)
	return (Math.abs(delta) <= maxDelta)
		? to
		: from + Math.sign(delta) * maxDelta
}

