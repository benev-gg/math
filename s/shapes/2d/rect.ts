
import {Vec2, Xy} from "../../core/vec2.js"
import {XyArray} from "../../core/tuples.js"
import {pointVsRect} from "../../physics/2d/collide2d.js"

export type RectJson = [min: XyArray, max: XyArray]
export type RectLike = {min: Xy, max: Xy}

export class Rect {
	constructor(
		public min: Vec2,
		public max: Vec2,
	) {}

	static from(data: RectJson | RectLike) {
		return Array.isArray(data)
			? new this(Vec2.from(data[0]), Vec2.from(data[1]))
			: new this(Vec2.from(data.min), Vec2.from(data.max))
	}

	static fromCorner(min: Xy, size: Xy) {
		const max = Vec2.from(min).add(size)
		return new this(Vec2.from(min), max)
	}

	static fromCenter(center: Xy, size: Xy) {
		const halfSize = Vec2.from(size).half()
		const min = Vec2.from(center).sub(halfSize)
		const max = Vec2.from(center).add(halfSize)
		return new this(min, max)
	}

	static point(vec: Xy) {
		return new this(Vec2.from(vec), Vec2.from(vec))
	}

	dup() {
		return new Rect(this.min.dup(), this.max.dup())
	}

	toJSON(): RectJson {
		return [this.min.toJSON(), this.max.toJSON()]
	}

	set(rect: RectLike) {
		this.min.set(rect.min)
		this.max.set(rect.max)
	}

	normalize() {
		const {min, max} = this
		this.min.set(Vec2.min(min, max))
		this.max.set(Vec2.max(min, max))
		return this
	}

	size() {
		return this.max.dup().sub(this.min)
	}

	center() {
		return this.min.dup().add(this.size().half())
	}

	translate(delta: Vec2) {
		this.min.add(delta)
		this.max.add(delta)
		return this
	}

	contains(point: Vec2) {
		return pointVsRect(point, this)
	}

	equals(rect: RectLike) {
		return (
			this.min.equals(rect.min) &&
			this.max.equals(rect.max)
		)
	}

	boundingBox() {
		return this.dup()
	}
}

