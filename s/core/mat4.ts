
import {Mat4Array} from "./tuples.js"
import {Quat, Xyzw} from "./quat.js"
import {Vec3, type Xyz} from "./vec3.js"

export function compose(
		buffer: Float32Array | Mat4Array,
		translation: Xyz,
		rotation: Xyzw,
		scale: Xyz,
	) {

	const {x, y, z, w} = rotation
	const sx = scale.x, sy = scale.y, sz = scale.z

	const x2 = x + x, y2 = y + y, z2 = z + z
	const xx = x * x2, xy = x * y2, xz = x * z2
	const yy = y * y2, yz = y * z2, zz = z * z2
	const wx = w * x2, wy = w * y2, wz = w * z2

	buffer[0] = (1 - (yy + zz)) * sx
	buffer[1] = (xy + wz) * sx
	buffer[2] = (xz - wy) * sx
	buffer[3] = 0

	buffer[4] = (xy - wz) * sy
	buffer[5] = (1 - (xx + zz)) * sy
	buffer[6] = (yz + wx) * sy
	buffer[7] = 0

	buffer[8] = (xz + wy) * sz
	buffer[9] = (yz - wx) * sz
	buffer[10] = (1 - (xx + yy)) * sz
	buffer[11] = 0

	buffer[12] = translation.x
	buffer[13] = translation.y
	buffer[14] = translation.z
	buffer[15] = 1
}

export function mat4Buffer() {
	return new Float32Array([
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	])
}

export class Mat4 {
	constructor(public buffer = mat4Buffer()) {}

	static new(buffer = mat4Buffer()) {
		return new this(buffer)
	}

	static from(tuple: ArrayLike<number>) {
		return new this(new Float32Array(tuple))
	}

	static compose(translation: Vec3, rotation: Quat, scale: Vec3) {
		const mat = new this()
		compose(mat.buffer, translation, rotation, scale)
		return mat
	}

	static fromQuat({x, y, z, w}: Xyzw) {
		const x2 = x + x
		const y2 = y + y
		const z2 = z + z

		const xx = x * x2
		const xy = x * y2
		const xz = x * z2
		const yy = y * y2
		const yz = y * z2
		const zz = z * z2
		const wx = w * x2
		const wy = w * y2
		const wz = w * z2

		return this.from([
			1 - yy - zz, xy - wz,     xz + wy,     0,
			xy + wz,     1 - xx - zz, yz - wx,     0,
			xz - wy,     yz + wx,     1 - xx - yy, 0,
			0,           0,           0,           1,
		])
	}

	dup() {
		return new Mat4(this.buffer.slice())
	}

	compose(translation: Vec3, rotation: Quat, scale: Vec3) {
		compose(this.buffer, translation, rotation, scale)
		return this
	}

	*[Symbol.iterator]() {
		yield* this.buffer
	}

	tuple() {
		return [...this.buffer] as Mat4Array
	}

	toJSON() {
		return this.tuple()
	}

	toString() {
		return `(Mat4 ${this.tuple().map(n => n.toFixed(2)).join(", ")})`
	}

	/** mutator */
	set(mat: Mat4) {
		this.buffer.set(mat.buffer)
		return this
	}

	/** mutator */
	from(array: ArrayLike<number>) {
		this.buffer.set(array)
		return this
	}

	/** mutator */
	mul(other: Mat4) {
		const a = this.buffer
		const b = other.buffer
		const r = new Float32Array(16)

		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				r[(row * 4) + col] =
					a[(row * 4) + 0] * b[(0 * 4) + col] +
					a[(row * 4) + 1] * b[(1 * 4) + col] +
					a[(row * 4) + 2] * b[(2 * 4) + col] +
					a[(row * 4) + 3] * b[(3 * 4) + col]
			}
		}

		this.buffer.set(r)
		return this
	}

	/** mutator */
	invert() {
		const [
			a00, a01, a02, a03,
			a10, a11, a12, a13,
			a20, a21, a22, a23,
			a30, a31, a32, a33,
		] = this.buffer

		const b00 = a00 * a11 - a01 * a10
		const b01 = a00 * a12 - a02 * a10
		const b02 = a00 * a13 - a03 * a10
		const b03 = a01 * a12 - a02 * a11
		const b04 = a01 * a13 - a03 * a11
		const b05 = a02 * a13 - a03 * a12
		const b06 = a20 * a31 - a21 * a30
		const b07 = a20 * a32 - a22 * a30
		const b08 = a20 * a33 - a23 * a30
		const b09 = a21 * a32 - a22 * a31
		const b10 = a21 * a33 - a23 * a31
		const b11 = a22 * a33 - a23 * a32

		let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
		if (!det) return this

		det = 1 / det

		this.buffer.set([
			(a11 * b11 - a12 * b10 + a13 * b09) * det,
			(a02 * b10 - a01 * b11 - a03 * b09) * det,
			(a31 * b05 - a32 * b04 + a33 * b03) * det,
			(a22 * b04 - a21 * b05 - a23 * b03) * det,

			(a12 * b08 - a10 * b11 - a13 * b07) * det,
			(a00 * b11 - a02 * b08 + a03 * b07) * det,
			(a32 * b02 - a30 * b05 - a33 * b01) * det,
			(a20 * b05 - a22 * b02 + a23 * b01) * det,

			(a10 * b10 - a11 * b08 + a13 * b06) * det,
			(a01 * b08 - a00 * b10 - a03 * b06) * det,
			(a30 * b04 - a31 * b02 + a33 * b00) * det,
			(a21 * b02 - a20 * b04 - a23 * b00) * det,

			(a11 * b07 - a10 * b09 - a12 * b06) * det,
			(a00 * b09 - a01 * b07 + a02 * b06) * det,
			(a31 * b01 - a30 * b03 - a32 * b00) * det,
			(a20 * b03 - a21 * b01 + a22 * b00) * det,
		])

		return this
	}

	transformPoint(point: Xyz) {
		const m = this.buffer
		const {x, y, z} = point

		const tx = x * m[0] + y * m[1] + z * m[2] + m[3]
		const ty = x * m[4] + y * m[5] + z * m[6] + m[7]
		const tz = x * m[8] + y * m[9] + z * m[10] + m[11]
		const tw = x * m[12] + y * m[13] + z * m[14] + m[15]

		return tw && tw !== 1
			? new Vec3(tx / tw, ty / tw, tz / tw)
			: new Vec3(tx, ty, tz)
	}

	transformVector({x, y, z}: Xyz) {
		const m = this.buffer
		return new Vec3(
			x * m[0] + y * m[1] + z * m[2],
			x * m[4] + y * m[5] + z * m[6],
			x * m[8] + y * m[9] + z * m[10],
		)
	}
}

