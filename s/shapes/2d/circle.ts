
import {Rect} from "./rect.js"
import {Vec2} from "../../core/vec2.js"
import {Xy, XyArray} from "../../core/types.js"

export type CircleArray = [...XyArray, radius: number]
export type CircleLike = {center: Xy, radius: number}

export class Circle {
	constructor(
		public center: Vec2,
		public radius: number,
	) {}

	static from(data: CircleArray | CircleLike) {
		return Array.isArray(data)
			? new this(new Vec2(data[0], data[1]), data[2])
			: new this(Vec2.from(data.center), data.radius)
	}

	array(): CircleArray {
		return [...this.center.array(), this.radius]
	}

	toJSON(): CircleLike {
		return {center: this.center.toJSON(), radius: this.radius}
	}

	dup() {
		return new Circle(this.center.dup(), this.radius)
	}

	set(circle: CircleLike) {
		this.center.set(circle.center)
		this.radius = circle.radius
	}

	translate(delta: Vec2) {
		this.center.add(delta)
		return this
	}

	boundingBox() {
		const size = Vec2.fill(this.radius * 2)
		return Rect.fromCenter(this.center.dup(), size)
	}
}

