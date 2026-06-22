
import {Scalar} from "./scalar.js"
import {Tuple3} from "./tuples.js"

export type Xyz = {x: number, y: number, z: number}

export class Vec3 {
	constructor(
		public x = 0,
		public y = 0,
		public z = 0,
	) {}

	static new(x = 0, y = 0, z = 0) {
		return new this(x, y, z)
	}

	static zero() {
		return new this(0, 0, 0)
	}

	static all(value: number) {
		return new this(value, value, value)
	}

	static from(v: Tuple3 | Xyz) {
		return Array.isArray(v)
			? new this(...v)
			: new this(v.x, v.y, v.z)
	}

	static magnitudeSquared(x: number, y: number, z: number) {
		return (x ** 2) + (y ** 2) + (z ** 2)
	}

	static magnitude(x: number, y: number, z: number) {
		return Math.sqrt(this.magnitudeSquared(x, y, z))
	}

	static average(...vecs: Xyz[]) {
		return this.zero()
			.add(...vecs)
			.divBy(vecs.length)
	}

	static min(...vecs: Xyz[]) {
		return new this(
			Math.min(...vecs.map(v => v.x)),
			Math.min(...vecs.map(v => v.y)),
			Math.min(...vecs.map(v => v.z)),
		)
	}

	static max(...vecs: Xyz[]) {
		return new this(
			Math.max(...vecs.map(v => v.x)),
			Math.max(...vecs.map(v => v.y)),
			Math.max(...vecs.map(v => v.z)),
		)
	}

	static fromHex(hex: string): Vec3 {
		if (hex.startsWith("#") && hex.length === 7) {
			const r = parseInt(hex.slice(1, 3), 16) / 255
			const g = parseInt(hex.slice(3, 5), 16) / 255
			const b = parseInt(hex.slice(5, 7), 16) / 255
			return new this(r, g, b)
		} else {
			throw new Error("invalid hex color format")
		}
	}

	dup() {
		return new Vec3(this.x, this.y, this.z)
	}

	*[Symbol.iterator]() {
		yield this.x
		yield this.y
		yield this.z
	}

	tuple(): Tuple3 {
		return [this.x, this.y, this.z]
	}

	toJSON(): Tuple3 {
		return this.tuple()
	}

	toString() {
		return `(Vec3 x${this.x.toFixed(2)}, y${this.y.toFixed(2)}, z${this.z.toFixed(2)})`
	}

	/** mutator */
	set_(x: number, y: number, z: number) {
		this.x = x
		this.y = y
		this.z = z
		return this
	}

	/** mutator */
	set({x, y, z}: Xyz) {
		this.x = x
		this.y = y
		this.z = z
		return this
	}

	/** mutator */
	from(v: Xyz | Tuple3) {
		if (Array.isArray(v)) {
			const [x, y, z] = v
			this.x = x
			this.y = y
			this.z = z
		}
		else {
			const {x, y, z} = v
			this.x = x
			this.y = y
			this.z = z
		}
		return this
	}


	magnitudeSquared() {
		return Vec3.magnitudeSquared(this.x, this.y, this.z)
	}

	magnitude() {
		return Vec3.magnitude(this.x, this.y, this.z)
	}

	/** rgb values from 0-1 */
	toHex() {
		const to255 = (val: number) => Math.round(Scalar.clamp(val * 255, 0, 255))
		const toHex = (val: number) => to255(val).toString(16).padStart(2, '0')
		return `#${toHex(this.x)}${toHex(this.y)}${toHex(this.z)}`
	}

	equals_(x: number, y: number, z: number) {
		return (
			this.x === x &&
			this.y === y &&
			this.z === z
		)
	}

	equals(...vecs: Xyz[]) {
		return vecs.every(({x, y, z}) => this.equals_(x, y, z))
	}

	near_(x: number, y: number, z: number, epsilon = 1e-6) {
		return (
			Math.abs(this.x - x) <= epsilon &&
			Math.abs(this.y - y) <= epsilon &&
			Math.abs(this.z - z) <= epsilon
		)
	}

	near({x, y, z}: Xyz, epsilon = 1e-6) {
		return this.near_(x, y, z, epsilon)
	}

	distanceSquared_(x: number, y: number, z: number) {
		const dx = this.x - x
		const dy = this.y - y
		const dz = this.z - z
		return (dx ** 2) + (dy ** 2) + (dz ** 2)
	}

	distanceSquared({x, y, z}: Xyz) {
		return this.distanceSquared_(x, y, z)
	}

	distance_(x: number, y: number, z: number) {
		return Math.sqrt(this.distanceSquared_(x, y, z))
	}

	distance({x, y, z}: Xyz) {
		return this.distance_(x, y, z)
	}

	dot_(x: number, y: number, z: number) {
		return (this.x * x) + (this.y * y) + (this.z * z)
	}

	dot({x, y, z}: Xyz) {
		return this.dot_(x, y, z)
	}

	inRange_(x: number, y: number, z: number, radius: number) {
		const d2 = this.distanceSquared_(x, y, z)
		return d2 < (radius ** 2)
	}

	inRange({x, y, z}: Xyz, radius: number) {
		return this.inRange_(x, y, z, radius)
	}

	angleBetween_(x: number, y: number, z: number) {
		const dotProduct = this.dot_(x, y, z)
		const magnitudes = this.magnitude() * Vec3.magnitude(x, y, z)
		if (magnitudes === 0) return 0
		const ratio = Scalar.clamp(dotProduct / magnitudes, -1, 1)
		return Math.acos(ratio)
	}

	angleBetween({x, y, z}: Xyz) {
		return this.angleBetween_(x, y, z)
	}

	/** mutator */
	add_(x: number, y: number, z: number) {
		this.x += x
		this.y += y
		this.z += z
		return this
	}

	/** mutator */
	add(...vecs: Xyz[]) {
		for (const {x, y, z} of vecs) this.add_(x, y, z)
		return this
	}

	/** mutator */
	sub_(x: number, y: number, z: number) {
		this.x -= x
		this.y -= y
		this.z -= z
		return this
	}

	/** mutator */
	sub(...vecs: Xyz[]) {
		for (const {x, y, z} of vecs) this.sub_(x, y, z)
		return this
	}

	/** mutator */
	mul_(x: number, y: number, z: number) {
		this.x *= x
		this.y *= y
		this.z *= z
		return this
	}

	/** mutator */
	mul(...vecs: Xyz[]) {
		for (const {x, y, z} of vecs) this.mul_(x, y, z)
		return this
	}

	/** mutator */
	div_(x: number, y: number, z: number) {
		if (x !== 0) this.x /= x
		if (y !== 0) this.y /= y
		if (z !== 0) this.z /= z
		return this
	}

	/** mutator */
	div(...vecs: Xyz[]) {
		for (const {x, y, z} of vecs) this.div_(x, y, z)
		return this
	}

	///////////////////////////////////////////////////////////////////////

	/** mutator */
	half() {
		return this.divBy(2)
	}

	/** mutator */
	double() {
		return this.mulBy(2)
	}

	/** mutator */
	abs() {
		return this.map(x => Math.abs(x))
	}

	/** mutator */
	map(fn: (a: number, index: number) => number) {
		this.x = fn(this.x, 0)
		this.y = fn(this.y, 1)
		this.z = fn(this.z, 2)
		return this
	}

	/** mutator */
	morph(fn: (vec: Vec3) => (Xyz | void)) {
		const result = fn(this)
		if (result && result !== this) this.set(result)
		return this
	}

	/** mutator */
	negate() {
		this.x = -this.x
		this.y = -this.y
		this.z = -this.z
		return this
	}

	/** mutator */
	clamp(min: Xyz = {x: 0, y: 0, z: 0}, max: Xyz = {x: 1, y: 1, z: 1}) {
		this.x = Scalar.clamp(this.x, min.x, max.x)
		this.y = Scalar.clamp(this.y, min.y, max.y)
		this.z = Scalar.clamp(this.z, min.z, max.z)
		return this
	}

	/** mutator */
	clampBy(min = 0, max = 1) {
		this.x = Scalar.clamp(this.x, min, max)
		this.y = Scalar.clamp(this.y, min, max)
		this.z = Scalar.clamp(this.z, min, max)
		return this
	}

	/** mutator */
	addBy(delta: number) {
		this.x += delta
		this.y += delta
		this.z += delta
		return this
	}

	/** mutator */
	subBy(delta: number) {
		this.x -= delta
		this.y -= delta
		this.z -= delta
		return this
	}

	/** mutator */
	mulBy(delta: number) {
		this.x *= delta
		this.y *= delta
		this.z *= delta
		return this
	}

	/** mutator */
	scale(delta: number) {
		this.x *= delta
		this.y *= delta
		this.z *= delta
		return this
	}

	/** mutator */
	divBy(divisor: number) {
		if (divisor === 0) return this
		this.x /= divisor
		this.y /= divisor
		this.z /= divisor
		return this
	}

	/** mutator */
	normalize() {
		return this.divBy(this.magnitude())
	}

	/** mutator */
	clampMagnitude(max: number) {
		const magnitude = this.magnitude()
		if (magnitude > max) this.normalize().mulBy(max)
		return this
	}

	/** mutator */
	floor(): this {
		this.x = Math.floor(this.x)
		this.y = Math.floor(this.y)
		this.z = Math.floor(this.z)
		return this
	}

	/** mutator */
	ceil(): this {
		this.x = Math.ceil(this.x)
		this.y = Math.ceil(this.y)
		this.z = Math.ceil(this.z)
		return this
	}

	/** mutator */
	round(): this {
		this.x = Math.round(this.x)
		this.y = Math.round(this.y)
		this.z = Math.round(this.z)
		return this
	}

	///////////////////////////////////////////////////////////////////////

	/** mutator */
	cross_(x2: number, y2: number, z2: number) {
		const {x: x1, y: y1, z: z1} = this
		this.x = (y1 * z2) - (z1 * y2)
		this.y = (z1 * x2) - (x1 * z2)
		this.z = (x1 * y2) - (y1 * x2)
		return this
	}

	/** mutator */
	cross({x, y, z}: Xyz) {
		return this.cross_(x, y, z)
	}

	/** mutator */
	lerp_(x: number, y: number, z: number, fraction: number): this {
		this.x += (x - this.x) * fraction
		this.y += (y - this.y) * fraction
		this.z += (z - this.z) * fraction
		return this
	}

	/** mutator */
	lerp({x, y, z}: Xyz, fraction: number) {
		return this.lerp_(x, y, z, fraction)
	}

	approach_(x: number, y: number, z: number, speed: number, deltaTime: number, speedLimit?: number) {
		this.x = Scalar.approach(this.x, x, speed, deltaTime, speedLimit)
		this.y = Scalar.approach(this.y, y, speed, deltaTime, speedLimit)
		this.z = Scalar.approach(this.z, z, speed, deltaTime, speedLimit)
		return this
	}

	approach({x, y, z}: Xyz, speed: number, deltaTime: number, speedLimit?: number) {
		return this.approach_(x, y, z, speed, deltaTime, speedLimit)
	}

	/** mutator */
	projectOnto_(x: number, y: number, z: number) {
		const m2 = Vec3.magnitudeSquared(x, y, z)
		if (!m2) return this
		const scalar = this.dot_(x, y, z) / m2
		this.x = scalar * x
		this.y = scalar * y
		this.z = scalar * z
		return this
	}

	/** mutator */
	projectOnto({x, y, z}: Xyz) {
		return this.projectOnto_(x, y, z)
	}

	/** mutator */
	reflect_(x: number, y: number, z: number) {
		const dot = this.dot_(x, y, z) * 2
		this.x -= dot * x
		this.y -= dot * y
		this.z -= dot * z
		return this
	}

	/** mutator */
	reflect({x, y, z}: Xyz) {
		return this.reflect_(x, y, z)
	}

	/** mutator */
	rotateAroundAxis_(ux: number, uy: number, uz: number, angle: number): this {
		const cos = Math.cos(angle)
		const sin = Math.sin(angle)
		const {x, y, z} = this
		this.x = (cos + (1 - cos) * ux * ux) * x + ((1 - cos) * ux * uy - uz * sin) * y + ((1 - cos) * ux * uz + uy * sin) * z
		this.y = ((1 - cos) * uy * ux + uz * sin) * x + (cos + (1 - cos) * uy * uy) * y + ((1 - cos) * uy * uz - ux * sin) * z
		this.z = ((1 - cos) * uz * ux - uy * sin) * x + ((1 - cos) * uz * uy + ux * sin) * y + (cos + (1 - cos) * uz * uz) * z
		return this
	}

	/** mutator */
	rotateAroundAxis({x, y, z}: Xyz, angle: number) {
		return this.rotateAroundAxis_(x, y, z, angle)
	}

	/** mutator */
	smooth_(x: number, y: number, z: number, smoothing: number) {
		this.x = Scalar.smooth(this.x, x, smoothing)
		this.y = Scalar.smooth(this.y, y, smoothing)
		this.z = Scalar.smooth(this.z, z, smoothing)
		return this
	}

	/** mutator */
	smooth({x, y, z}: Xyz, smoothing: number) {
		return this.smooth_(x, y, z, smoothing)
	}
}

