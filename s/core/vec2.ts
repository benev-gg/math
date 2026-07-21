
import {clamp} from "./basics.js"
import {XyArray} from "./tuples.js"

export type Xy = {x: number, y: number}

export const index2d = (extent: Xy, vec: Xy) => {
	return (vec.y * extent.x) + vec.x
}

export const unindex2d = (extent: Xy, index: number) => {
	const x = index % extent.x
	const y = Math.floor(index / extent.x)
	return new Vec2(x, y)
}

export class Vec2 implements Xy {
	constructor(
		public x = 0,
		public y = 0,
	) {}

	static new(x = 0, y = 0) {
		return new this(x, y)
	}

	static zero() {
		return new this(0, 0)
	}

	static all(value: number) {
		return new this(value, value)
	}

	static from(v: XyArray | Xy) {
		return Array.isArray(v)
			? new this(...v)
			: new this(v.x, v.y)
	}

	static magnitudeSquared(x: number, y: number) {
		return (x * x) + (y * y)
	}

	static magnitude(x: number, y: number) {
		return Math.sqrt(this.magnitudeSquared(x, y))
	}

	static average(...vectors: Xy[]) {
		return this.zero()
			.add(...vectors)
			.divBy(vectors.length)
	}

	static min(...vecs: Xy[]) {
		return new this(
			Math.min(...vecs.map(v => v.x)),
			Math.min(...vecs.map(v => v.y)),
		)
	}

	static max(...vecs: Xy[]) {
		return new this(
			Math.max(...vecs.map(v => v.x)),
			Math.max(...vecs.map(v => v.y)),
		)
	}

	static rotation(radians: number) {
		return new this(
			Math.cos(radians),
			Math.sin(radians),
		)
	}

	dup() {
		return new Vec2(this.x, this.y)
	}

	*[Symbol.iterator]() {
		yield this.x
		yield this.y
	}

	tuple(): XyArray {
		return [this.x, this.y]
	}

	toJSON(): XyArray {
		return this.tuple()
	}

	toString() {
		return `(Vec2 x${this.x.toFixed(2)}, y${this.y.toFixed(2)})`
	}

	/** mutator */
	set_(x: number, y: number) {
		this.x = x
		this.y = y
		return this
	}

	/** mutator */
	set({x, y}: Xy) {
		this.x = x
		this.y = y
		return this
	}

	/** mutator */
	from(v: Xy | XyArray) {
		if (Array.isArray(v)) {
			const [x, y] = v
			this.x = x
			this.y = y
		}
		else {
			const {x, y} = v
			this.x = x
			this.y = y
		}
		return this
	}

	magnitudeSquared() {
		return Vec2.magnitudeSquared(this.x, this.y)
	}

	magnitude() {
		return Vec2.magnitude(this.x, this.y)
	}

	rotation() {
		return Math.atan2(this.y, this.x)
	}

	equals_(x: number, y: number) {
		return (
			this.x === x &&
			this.y === y
		)
	}

	equals(...vecs: Xy[]) {
		return vecs.every(({x, y}) => this.equals_(x, y))
	}

	near_(x: number, y: number, epsilon = 1e-6) {
		return (
			Math.abs(this.x - x) <= epsilon &&
			Math.abs(this.y - y) <= epsilon
		)
	}

	near({x, y}: Xy, epsilon = 1e-6) {
		return this.near_(x, y, epsilon)
	}

	dot_(x: number, y: number) {
		return (this.x * x) + (this.y * y)
	}

	dot({x, y}: Xy) {
		return this.dot_(x, y)
	}

	distanceSquared_(x: number, y: number) {
		x = this.x - x
		y = this.y - y
		return (x * x) + (y * y)
	}

	distanceSquared({x, y}: Xy) {
		return this.distanceSquared_(x, y)
	}

	distance_(x: number, y: number) {
		return Math.sqrt(this.distanceSquared_(x, y))
	}

	distance({x, y}: Xy) {
		return this.distance_(x, y)
	}

	angleBetween_(x: number, y: number) {
		const dot = this.dot_(x, y)
		const magnitudes = this.magnitude() * Vec2.magnitude(x, y)
		if (magnitudes === 0) return 0
		const ratio = clamp(dot / magnitudes, -1, 1)
		return Math.acos(ratio)
	}

	angleBetween({x, y}: Xy) {
		return this.angleBetween_(x, y)
	}

	/** mutator */
	normalize() {
		return this.divBy(this.magnitude())
	}

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
	rotate(radians: number) {
		const {x, y} = this
		this.x = (x * Math.cos(radians)) - (y * Math.sin(radians))
		this.y = (x * Math.sin(radians)) + (y * Math.cos(radians))
		return this
	}

	/** mutator */
	perpendicular() {
		const {x, y} = this
		this.x = -y
		this.y = x
		return this
	}

	/** mutator */
	clampMagnitude(max: number) {
		const mag = this.magnitude()
		if (mag > max)
			this.normalize().mulBy(max)
		return this
	}

	/** mutator */
	floor() {
		this.x = Math.floor(this.x)
		this.y = Math.floor(this.y)
		return this
	}

	/** mutator */
	ceil() {
		this.x = Math.ceil(this.x)
		this.y = Math.ceil(this.y)
		return this
	}

	/** mutator */
	round() {
		this.x = Math.round(this.x)
		this.y = Math.round(this.y)
		return this
	}

	/** mutator */
	map(fn: (a: number, index: number) => number) {
		this.x = fn(this.x, 0)
		this.y = fn(this.y, 1)
		return this
	}

	/** mutator */
	morph(fn: (vec: Vec2) => (Xy | void)) {
		const result = fn(this)
		if (result && result !== this) this.set(result)
		return this
	}

	/** mutator */
	clamp(min: Xy = {x: 0, y: 0}, max: Xy = {x: 1, y: 1}) {
		this.x = clamp(this.x, min.x, max.x)
		this.y = clamp(this.y, min.y, max.y)
		return this
	}

	/** mutator */
	clampBy(min = 0, max = 1) {
		this.x = clamp(this.x, min, max)
		this.y = clamp(this.y, min, max)
		return this
	}

	/** mutator */
	negate() {
		return this.map(a => a * -1)
	}

	/** mutator */
	addBy(delta: number) {
		this.x += delta
		this.y += delta
		return this
	}

	/** mutator */
	subBy(delta: number) {
		this.x -= delta
		this.y -= delta
		return this
	}

	/** mutator */
	mulBy(coefficient: number) {
		this.x *= coefficient
		this.y *= coefficient
		return this
	}

	/** mutator */
	scale(coefficient: number) {
		this.x *= coefficient
		this.y *= coefficient
		return this
	}

	/** mutator */
	divBy(divisor: number) {
		if (divisor === 0) return this
		this.x /= divisor
		this.y /= divisor
		return this
	}

	///////////////////////////////////////////////////////////////////////

	/** mutator */
	add_(x: number, y: number) {
		this.x += x
		this.y += y
		return this
	}

	/** mutator */
	add(...vecs: Xy[]) {
		for (const {x, y} of vecs) this.add_(x, y)
		return this
	}

	/** mutator */
	sub_(x: number, y: number) {
		this.x -= x
		this.y -= y
		return this
	}

	/** mutator */
	sub(...vecs: Xy[]) {
		for (const {x, y} of vecs) this.sub_(x, y)
		return this
	}

	/** mutator */
	mul_(x: number, y: number) {
		this.x *= x
		this.y *= y
		return this
	}

	/** mutator */
	mul(...vecs: Xy[]) {
		for (const {x, y} of vecs) this.mul_(x, y)
		return this
	}

	/** mutator */
	div_(x: number, y: number) {
		if (x !== 0) this.x /= x
		if (y !== 0) this.y /= y
		return this
	}

	/** mutator */
	div(...vecs: Xy[]) {
		for (const {x, y} of vecs) this.div_(x, y)
		return this
	}

	/** mutator */
	lerp_(x: number, y: number, fraction: number) {
		this.x += (x - this.x) * fraction
		this.y += (y - this.y) * fraction
		return this
	}

	/** mutator */
	lerp(fraction: number, {x, y}: Xy) {
		return this.lerp_(fraction, x, y)
	}

	/** mutator */
	reflect_(x: number, y: number) {
		const dot = 2 * this.dot_(x, y)
		this.x -= dot * x
		this.y -= dot * y
		return this
	}

	/** mutator */
	reflect({x, y}: Xy) {
		return this.reflect_(x, y)
	}

	/** mutator */
	rotateAroundPoint_(radians: number, x: number, y: number) {
		const dx = this.x - x
		const dy = this.y - y
		const cos = Math.cos(radians)
		const sin = Math.sin(radians)
		this.x = cos * dx - sin * dy + x
		this.y = sin * dx + cos * dy + y
		return this
	}

	/** mutator */
	rotateAroundPoint(radians: number, {x, y}: Xy) {
		return this.rotateAroundPoint_(radians, x, y)
	}
}

