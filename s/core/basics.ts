
export const {min, max, abs, sign, floor, ceil, pow} = Math

export function clamp(x: number, a: number = 0, b: number = 1) {
	x = min(x, b)
	x = max(x, a)
	return x
}

export function lerp(from: number, to: number, fraction: number, max?: number) {
	const difference = to - from
	let delta = difference * fraction
	if (max !== undefined && abs(delta) > max)
		delta = sign(delta) * max
	return from + delta
}

/** calculate a time-based lerp factor */
export function halflife(halfTime: number, deltaTime: number) {
	return 1 - pow(0.5, deltaTime / halfTime)
}

export function approach(from: number, to: number, maxDelta: number) {
	const delta = clamp(to - from, -maxDelta, maxDelta)
	return from + delta
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

export function circularNormalize(x: number) {
	return wrap(x, 0, Math.PI * 2)
}

export function circularDelta(from: number, to: number) {
	return Math.atan2(
		Math.sin(to - from),
		Math.cos(to - from),
	)
}

export function circularApproach(from: number, to: number, maxDelta: number) {
	const delta = circularDelta(from, to)
	return (Math.abs(delta) <= maxDelta)
		? to
		: from + Math.sign(delta) * maxDelta
}

export function map(fraction: number, a: number, b: number) {
	const difference = b - a
	const value = difference * fraction
	return a + value
}

export function remap(x: number, a1: number, a2: number, b1: number = 0, b2: number = 1, clamping = false) {
	const fraction = (x - a1) / (a2 - a1)
	const result = (fraction * (b2 - b1)) + b1
	return clamping
		? clamp(result, b1, b2)
		: result
}

