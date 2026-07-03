
import {wrap} from "../core/basics.js"

export const pi = Math.PI

/** basic unit for measuring rotations */
export const radians = {
	circle: 2 * pi,
	halfCircle: pi,

	toDegrees(r: number) {
		return r * (180 / pi)
	},

	toArcseconds(r: number) {
		return radians.toDegrees(r) * 3600
	},

	toTurns(r: number) {
		return r / radians.circle
	},

	circleDistance(radiansA: number, radiansB: number): number {
		const diff = Math.abs(wrap(radiansA - radiansB, 0, radians.circle))
		return Math.min(diff, radians.circle - diff)
	},
}

/** convert turns to radians */
export function turns(t: number) {
	return t * radians.circle
}
turns.toRadians = turns
turns.toDegrees = (t: number) => radians.toDegrees(turns(t))

/** convert arcseconds to radians */
export function arcseconds(a: number) {
	return degrees.toRadians(a / 3600)
}
arcseconds.toRadians = arcseconds
arcseconds.toDegrees = (a: number) => radians.toDegrees(arcseconds(a))

/** convert degrees to radians */
export function degrees(d: number) {
	return d * (pi / 180)
}
degrees.toRadians = degrees
degrees.toTurns = (d: number) => radians.toTurns(degrees(d))

