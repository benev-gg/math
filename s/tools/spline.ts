
import {clamp, lerp} from "../core/basics.js"
import {Vec2, type Xy} from "../core/vec2.js"
import {Vec3, type Xyz} from "../core/vec3.js"
import type {XyArray} from "../core/tuples.js"

/** input/value pairs, with strictly increasing input coordinates. */
type Knots = readonly Readonly<XyArray>[]

// all functions require at least two points and finite numeric inputs.
// uniform functions give each segment an equal share of the 0–1 interval.
// vector functions return a fresh vector and preserve the supplied points.

/** linear spline with uniformly spaced values over 0–1; extrapolates outside. */
export function linear(noul: number, points: readonly number[]) {
	const segment = uniformSegment(noul, points.length)
	const fraction = noul * (points.length - 1) - segment
	return lerp(fraction, points[segment], points[segment + 1])
}

/** piecewise-linear 2d path with uniformly spaced control points over 0–1; extrapolates outside. */
export function linear2d(noul: number, points: readonly Xy[]) {
	const segment = uniformSegment(noul, points.length)
	const fraction = noul * (points.length - 1) - segment
	const start = points[segment]
	const end = points[segment + 1]

	return new Vec2(
		lerp(fraction, start.x, end.x),
		lerp(fraction, start.y, end.y),
	)
}

/** piecewise-linear 3d path with uniformly spaced control points over 0–1; extrapolates outside. */
export function linear3d(noul: number, points: readonly Xyz[]) {
	const segment = uniformSegment(noul, points.length)
	const fraction = noul * (points.length - 1) - segment
	const start = points[segment]
	const end = points[segment + 1]

	return new Vec3(
		lerp(fraction, start.x, end.x),
		lerp(fraction, start.y, end.y),
		lerp(fraction, start.z, end.z),
	)
}

/** uniform scalar catmull-rom spline over 0–1; extrapolates along endpoint tangents. may overshoot. */
export function catmull(noul: number, points: readonly number[]) {
	const segment = uniformSegment(noul, points.length)
	const fraction = noul * (points.length - 1) - segment

	return catmullSegment(
		fraction,
		points[segment],
		points[segment + 1],
		points[segment - 1],
		points[segment + 2],
	)
}

/** uniform 2d catmull-rom path over 0–1; extrapolates along endpoint tangents. may overshoot. */
export function catmull2d(noul: number, points: readonly Xy[]) {
	const segment = uniformSegment(noul, points.length)
	const fraction = noul * (points.length - 1) - segment
	const start = points[segment]
	const end = points[segment + 1]
	const previous = points[segment - 1]
	const next = points[segment + 2]

	return new Vec2(
		catmullSegment(fraction, start.x, end.x, previous?.x, next?.x),
		catmullSegment(fraction, start.y, end.y, previous?.y, next?.y),
	)
}

/** uniform 3d catmull-rom path over 0–1; extrapolates along endpoint tangents. may overshoot. */
export function catmull3d(noul: number, points: readonly Xyz[]) {
	const segment = uniformSegment(noul, points.length)
	const fraction = noul * (points.length - 1) - segment
	const start = points[segment]
	const end = points[segment + 1]
	const previous = points[segment - 1]
	const next = points[segment + 2]

	return new Vec3(
		catmullSegment(fraction, start.x, end.x, previous?.x, next?.x),
		catmullSegment(fraction, start.y, end.y, previous?.y, next?.y),
		catmullSegment(fraction, start.z, end.z, previous?.z, next?.z),
	)
}

/** uniform scalar spline using smoothstep per segment; holds endpoint values outside 0–1. */
export function smooth(noul: number, points: readonly number[]) {
	const segment = uniformSegment(noul, points.length)
	const fraction = noul * (points.length - 1) - segment
	return lerp(ease(fraction), points[segment], points[segment + 1])
}

/** linear spline through input/value pairs; extrapolates with the nearest end segment. */
export function splineLinear(x: number, points: Knots) {
	const segment = findSegment(x, points)
	const [x0, y0] = points[segment]
	const [x1, y1] = points[segment + 1]
	const fraction = (x - x0) / (x1 - x0)
	return lerp(fraction, y0, y1)
}

/** smoothstep spline through input/value pairs; holds endpoint values outside the input range. */
export function splineSmooth(x: number, points: Knots) {
	const segment = findSegment(x, points)
	const [x0, y0] = points[segment]
	const [x1, y1] = points[segment + 1]
	const fraction = (x - x0) / (x1 - x0)
	return lerp(ease(fraction), y0, y1)
}

/** catmull-rom spline through input/value pairs; extrapolates along endpoint tangents. may overshoot. */
export function splineCatmull(x: number, points: Knots) {
	const segment = findSegment(x, points)
	const [x0, y0] = points[segment]
	const [x1, y1] = points[segment + 1]
	const span = x1 - x0
	const fraction = (x - x0) / span

	// convert slopes per unit x into tangents for this segment's 0–1 interval
	const startTangent = slopeAt(points, segment) * span
	const endTangent = slopeAt(points, segment + 1) * span
	return hermite(fraction, y0, y1, startTangent, endTangent)
}

/** evaluate one uniform catmull-rom segment; missing neighbors use the segment's slope. */
function catmullSegment(
		fraction: number,
		start: number,
		end: number,
		previous: number | undefined,
		next: number | undefined,
	) {
	const rise = end - start
	const startTangent = previous === undefined ? rise : (end - previous) / 2
	const endTangent = next === undefined ? rise : (next - start) / 2
	return hermite(fraction, start, end, startTangent, endTangent)
}

/** cubic segment matching endpoint values and tangents; extends tangents outside the segment. */
function hermite(
		fraction: number,
		start: number,
		end: number,
		startTangent: number,
		endTangent: number,
	) {
	if (fraction < 0) return start + fraction * startTangent
	if (fraction > 1) return end + (fraction - 1) * endTangent
	if (fraction === 0) return start
	if (fraction === 1) return end

	// cubic hermite coefficients
	const rise = end - start
	const a = startTangent + endTangent - 2 * rise
	const b = 3 * rise - 2 * startTangent - endTangent
	return ((a * fraction + b) * fraction + startTangent) * fraction + start
}

/** smoothstep with a flat extension outside the segment. */
function ease(fraction: number) {
	const t = clamp(fraction)
	return t * t * (3 - 2 * t)
}

/** select a uniform segment without allocating a result object or array. */
function uniformSegment(noul: number, pointCount: number) {
	if (pointCount < 2)
		throw new Error("need at least two points, come on")

	const position = noul * (pointCount - 1)
	return clamp(Math.floor(position), 0, pointCount - 2)
}

/** choose an interior segment, or the nearest end segment for extrapolation. */
function findSegment(x: number, points: Knots) {
	if (points.length < 2)
		throw new Error("need at least two points, come on")

	let segment = 0
	while (segment < points.length - 2 && x > points[segment + 1][0])
		segment++

	return segment
}

/** catmull-rom slope with uneven spacing; endpoints use their adjacent segment. */
function slopeAt(points: Knots, index: number) {
	if (index === 0) {
		const [x0, y0] = points[0]
		const [x1, y1] = points[1]
		return (y1 - y0) / (x1 - x0)
	}

	if (index === points.length - 1) {
		const [x0, y0] = points[index - 1]
		const [x1, y1] = points[index]
		return (y1 - y0) / (x1 - x0)
	}

	const [previousX, previousY] = points[index - 1]
	const [x, y] = points[index]
	const [nextX, nextY] = points[index + 1]

	const leftSpan = x - previousX
	const rightSpan = nextX - x
	const leftSlope = (y - previousY) / leftSpan
	const rightSlope = (nextY - y) / rightSpan

	// the slope across the shorter interval receives more weight
	return lerp(leftSpan / (leftSpan + rightSpan), leftSlope, rightSlope)
}

