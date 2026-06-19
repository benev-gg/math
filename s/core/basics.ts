
export const {min, max, abs, sign, floor, ceil, pow} = Math

export function clamp(x: number, a: number = 0, b: number = 1) {
	x = min(x, b)
	x = max(x, a)
	return x
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

