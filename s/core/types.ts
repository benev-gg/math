
import {Vec2} from "./vec2.js"

export type XyArray = [x: number, y: number]
export type XyzArray = [x: number, y: number, z: number]
export type XyzwArray = [x: number, y: number, z: number, w: number]

export type Xy = {x: number, y: number}
export type Xyz = {x: number, y: number, z: number}
export type Xyzw = {x: number, y: number, z: number, w: number}

export type Mat4Array = [
	number, number, number, number,
	number, number, number, number,
	number, number, number, number,
	number, number, number, number,
]

export type Cardinals<T extends Vec2 = Vec2> = [
	north: T,
	east: T,
	south: T,
	west: T,
]

export type Intercardinals<T extends Vec2 = Vec2> = [
	northEast: T,
	southEast: T,
	southWest: T,
	northWest: T,
]

