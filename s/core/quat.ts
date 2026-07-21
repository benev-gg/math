
import {Xyz} from "./vec3.js"
import {XyzwArray} from "./tuples.js"

export type Xyzw = {x: number, y: number, z: number, w: number}

export class Quat {
	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
		public w = 1,
	) {}

	static new(x = 0, y = 0, z = 0, w = 1) {
		return new this(x, y, z, w)
	}

	static from(q: XyzwArray | Xyzw) {
		return Array.isArray(q)
			? new this(...q)
			: new this(q.x, q.y, q.z, q.w)
	}

	static rotate_(pitch: number, yaw: number, roll: number) {
		return this.new().rotate_(pitch, yaw, roll)
	}

	static rotate(vec: Xyz) {
		return this.new().rotate(vec)
	}

	array(): XyzwArray {
		const {x, y, z, w} = this
		return [x, y, z, w]
	}

	/** @deprecated renamed to `array` */
	tuple() { return this.array() }

	toJSON(): XyzwArray {
		return this.array()
	}

	*[Symbol.iterator]() {
		yield this.x
		yield this.y
		yield this.z
		yield this.w
	}

	toString() {
		return `(Quat x${this.x.toFixed(2)}, y${this.y.toFixed(2)}, z${this.z.toFixed(2)}, w${this.w.toFixed(2)})`
	}

	dup() {
		return new Quat(...this.toJSON())
	}

	lengthSquared() {
		return this.x*this.x + this.y*this.y + this.z*this.z + this.w*this.w
	}

	length() {
		return Math.sqrt(this.lengthSquared())
	}

	isUnit(epsilon=1e-6) {
		return Math.abs(this.length() - 1) <= epsilon
	}

	ensureUnit(){
		if (!this.isUnit()) this.normalize()
		return this
	}

	normalize(){
		const m = this.length()
		if (!m) {
			this.x = this.y = this.z = 0
			this.w = 1
			return this
		}
		this.x /= m
		this.y /= m
		this.z /= m
		this.w /= m
		return this
	}

	conjugate() {
		this.x *= -1
		this.y *= -1
		this.z *= -1
		return this
	}

	invert() {
		const len2 = this.lengthSquared()
		if (!len2) return this.set_(0, 0, 0, 1)
		this.x = -this.x / len2
		this.y = -this.y / len2
		this.z = -this.z / len2
		this.w = this.w / len2
		return this
	}

	transform_(x: number, y: number, z: number, w: number, global = false) {
		if (global) {
			const original = this.dup()
			return this.set_(x, y, z, w).mul(original)
		}
		else {
			return this.mul_(x, y, z, w)
		}
	}

	transform({x, y, z, w}: Xyzw, global = false) {
		return this.transform_(x, y, z, w, global)
	}

	rotate_(pitch: number, yaw: number, roll: number, global = false): Quat {
		const cx = Math.cos(pitch * 0.5), sx = Math.sin(pitch * 0.5)
		const cy = Math.cos(yaw * 0.5), sy = Math.sin(yaw * 0.5)
		const cz = Math.cos(roll * 0.5), sz = Math.sin(roll * 0.5)
		const x = sx * cy * cz + cx * sy * sz
		const y = cx * sy * cz - sx * cy * sz
		const z = cx * cy * sz + sx * sy * cz
		const w = cx * cy * cz - sx * sy * sz
		return this.transform_(x, y, z, w, global)
	}

	rotate({x: pitch, y: yaw, z: roll}: Xyz, global = false) {
		return this.rotate_(pitch, yaw, roll, global)
	}

	rotateAroundAxis_(angle: number, axisX: number, axisY: number, axisZ: number, global = false): Quat {
		const halfAngle = angle * 0.5
		const sinHalf = Math.sin(halfAngle)
		const x = axisX * sinHalf
		const y = axisY * sinHalf
		const z = axisZ * sinHalf
		const w = Math.cos(halfAngle)
		return this.transform_(x, y, z, w, global)
	}

	rotateAroundAxis(angle: number, axis: Xyz, global = false): Quat {
		return this.rotateAroundAxis_(angle, axis.x, axis.y, axis.z, global)
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

	mul_(x2: number, y2: number, z2: number, w2: number): Quat {
		const {x, y, z, w} = this
		this.x = w * x2 + x * w2 + y * z2 - z * y2
		this.y = w * y2 - x * z2 + y * w2 + z * x2
		this.z = w * z2 + x * y2 - y * x2 + z * w2
		this.w = w * w2 - x * x2 - y * y2 - z * z2
		return this
	}

	mul(...quats: Quat[]) {
		for (const {x, y, z, w} of quats) this.mul_(x, y, z, w)
		return this
	}
}

