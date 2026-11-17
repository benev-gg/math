
import {XyzArray} from "../../core/types.js"
import {Vec3, Xyz} from "../../core/vec3.js"

export type BoxArray = [...XyzArray, ...XyzArray]
export type BoxLike = {min: Xyz, max: Xyz}

export class Box {
	constructor(
		public min: Vec3,
		public max: Vec3,
	) {}

	static from(d: BoxArray | BoxLike) {
		return Array.isArray(d)
			? new this(new Vec3(d[0], d[1], d[2]), new Vec3(d[3], d[4], d[5]))
			: new this(Vec3.from(d.min), Vec3.from(d.max))
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

	array(): BoxArray {
		return [...this.min.array(), ...this.max.array()]
	}

	toJSON(): BoxLike {
		return {min: this.min.toJSON(), max: this.max.toJSON()}
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

