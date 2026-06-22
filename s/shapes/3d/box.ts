
import {Tuple3} from "../../core/tuples.js"
import {Vec3, Xyz} from "../../core/vec3.js"

export type BoxJson = [min: Tuple3, max: Tuple3]
export type BoxLike = {min: Xyz, max: Xyz}

export class Box {
	constructor(
		public min: Vec3,
		public max: Vec3,
	) {}

	static from(data: BoxJson | BoxLike) {
		return Array.isArray(data)
			? new this(Vec3.from(data[0]), Vec3.from(data[1]))
			: new this(Vec3.from(data.min), Vec3.from(data.max))
	}

	static fromCorner(min: Vec3, size: Vec3) {
		return new this(min, min.dup().add(size))
	}

	static fromCenter(center: Vec3, size: Vec3) {
		const halfSize = size.dup().half()
		const min = center.dup().sub(halfSize)
		const max = center.dup().add(halfSize)
		return new this(min, max)
	}

	toJSON(): BoxJson {
		return [this.min.toJSON(), this.max.toJSON()]
	}

	dup() {
		return new Box(this.min.dup(), this.max.dup())
	}

	set(box: BoxLike) {
		this.min.set(box.min)
		this.max.set(box.max)
	}

	size() {
		return this.max.dup().sub(this.min)
	}

	center() {
		return this.min.dup().add(this.size().half())
	}

	normalize() {
		const {min, max} = this
		this.min.set(Vec3.min(min, max))
		this.max.set(Vec3.max(min, max))
		return this
	}

	translate_(x: number, y: number, z: number) {
		this.min.add_(x, y, z)
		this.max.add_(x, y, z)
		return this
	}

	translate(delta: Vec3) {
		this.min.add(delta)
		this.max.add(delta)
		return this
	}

	grow(increase: Vec3) {
		const halfIncrease = increase.dup().half()
		this.min.sub(halfIncrease)
		this.max.add(halfIncrease)
		return this
	}

	growBy(increase: number) {
		const halfIncrease = increase / 2
		this.min.subBy(halfIncrease)
		this.max.addBy(halfIncrease)
		return this
	}
}

