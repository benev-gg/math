
import {Vec3} from "../../core/vec3.js"

export class Segment {
	constructor(
		public start: Vec3,
		public end: Vec3,
	) {}

	vector() {
		return this.end.dup().sub(this.start)
	}

	length() {
		return this.start.distance(this.end)
	}

	center() {
		return this.start.dup()
			.add(this.end)
			.half()
	}

	dup() {
		return new Segment(
			this.start.dup(),
			this.end.dup(),
		)
	}

	fromStart(length: number) {
		const direction = this.vector().normalize()
		return this.start.dup().add(direction.mulBy(length))
	}

	point(fraction: number) {
		return this.start.dup().add(this.vector().mulBy(fraction))
	}

	scale(fraction: number) {
		const {center} = this
		const newHalfVector = this.vector().mulBy(fraction / 2)
		this.start.set(center().sub(newHalfVector))
		this.end.set(center().add(newHalfVector))
		return this
	}
}

