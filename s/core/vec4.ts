
import {Xyzw} from "./quat.js"
import {XyzwArray} from "./tuples.js"

export class Vec4 {
	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
		public w = 0,
	) {}

	static new(x = 0, y = 0, z = 0, w = 0) {
		return new this(x, y, z, w)
	}

	static zero() {
		return new this(0, 0, 0, 0)
	}

	static from(v: XyzwArray | Xyzw) {
		return Array.isArray(v)
			? new this(...v)
			: new this(v.x, v.y, v.z, v.w)
	}

	dup() {
		return new Vec4(this.x, this.y, this.z, this.w)
	}

	*[Symbol.iterator]() {
		yield this.x
		yield this.y
		yield this.z
		yield this.w
	}

	tuple(): XyzwArray {
		const {x, y, z, w} = this
		return [x, y, z, w]
	}

	toJSON(): XyzwArray {
		return this.tuple()
	}

	toString() {
		return `(Vec4 x${this.x.toFixed(2)}, y${this.y.toFixed(2)}, z${this.z.toFixed(2)}, w${this.w.toFixed(2)})`
	}

	set_(x: number, y: number, z: number, w: number) {
		this.x = x
		this.y = y
		this.z = z
		this.w = w
		return this
	}

	set({x, y, z, w}: Xyzw) {
		this.x = x
		this.y = y
		this.z = z
		this.w = w
		return this
	}

	/** mutator */
	map(fn: (a: number, index: number) => number) {
		this.x = fn(this.x, 0)
		this.y = fn(this.y, 1)
		this.z = fn(this.z, 2)
		this.w = fn(this.w, 3)
		return this
	}
}

