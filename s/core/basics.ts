
export const {min, max, abs, sign, floor, ceil} = Math

export function clamp(x: number, a: number = 0, b: number = 1) {
	x = min(x, b)
	x = max(x, a)
	return x
}

export function lerp(x: number, y: number, fraction: number, max?: number) {
	const difference = y - x
	let delta = difference * fraction
	if (max !== undefined && abs(delta) > max)
		delta = sign(delta) * max
	return x + delta
}

export function halflife(halfTime: number, deltaTime: number) {
	return 1 - Math.pow(0.5, deltaTime / halfTime)
}

export function approach(x: number, y: number, maxDelta: number) {
	const delta = clamp(y - x, -maxDelta, maxDelta)
	return x + delta
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

