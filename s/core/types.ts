
import {Vec2} from "./vec2.js"

export type XyArray = [x: number, y: number]
export type XyzArray = [x: number, y: number, z: number]
export type XyzwArray = [x: number, y: number, z: number, w: number]

export type Mat4Array = [
	number, number, number, number,
	number, number, number, number,
	number, number, number, number,
	number, number, number, number,
]

export type Cardinals = [
	north: Vec2,
	east: Vec2,
	south: Vec2,
	west: Vec2,
]

export type Intercardinals = [
	northEast: Vec2,
	southEast: Vec2,
	southWest: Vec2,
	northWest: Vec2,
]

