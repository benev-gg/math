
import {guarantee, need} from "@e280/stz"
import {Vec2, Xy} from "../core/vec2.js"
import {Rect, RectLike} from "../shapes/2d/rect.js"
import {collideRectVsRect} from "../physics/2d/collide.js"

export class Lattice<X> {
	#cellsByHash = new Map<string, Cell<X>>()
	#memberships = new Map<X, {rect: Rect, cells: Set<Cell<X>>}>()

	constructor(private cellExtent: Vec2) {}

	get count() {
		return this.#memberships.size
	}

	get cellCount() {
		return this.#cellsByHash.size
	}

	has(item: X) {
		return this.#memberships.has(item)
	}

	upsert(item: X, rect: RectLike) {
		this.remove(item)
		const cells = new Set(this.#cellsForRect(rect))
		this.#memberships.set(item, {rect: Rect.from(rect), cells})
		for (const cell of cells)
			cell.items.add(item)
	}

	remove(item: X) {
		const membership = this.#memberships.get(item)
		if (!membership) return

		for (const cell of membership.cells) {
			cell.items.delete(item)
			if (cell.items.size === 0)
				this.#cellsByHash.delete(hash(cellIndex(cell.rect.min, this.cellExtent)))
		}

		this.#memberships.delete(item)
	}

	clear() {
		this.#cellsByHash.clear()
		this.#memberships.clear()
	}

	*query(rect: RectLike) {
		const seen = new Set<X>()

		for (const index of this.#cellIndices(rect)) {
			const cell = this.#cellsByHash.get(hash(index))
			if (!cell) continue

			for (const item of cell.items) {
				if (seen.has(item)) continue
				seen.add(item)

				const membership = need(this.#memberships, item)
				if (collideRectVsRect(membership.rect, rect))
					yield item
			}
		}
	}

	*#cellIndices(rect: RectLike) {
		const min = cellIndex(rect.min, this.cellExtent)
		const max = new Vec2(
			maxCellIndex(rect.min.x, rect.max.x, this.cellExtent.x),
			maxCellIndex(rect.min.y, rect.max.y, this.cellExtent.y),
		)
		for (let x = min.x; x <= max.x; x++)
			for (let y = min.y; y <= max.y; y++)
				yield new Vec2(x, y)
	}

	*#cellsForRect(rect: RectLike) {
		for (const index of this.#cellIndices(rect)) {
			yield guarantee(this.#cellsByHash, hash(index), () => {
				const min = index.mul(this.cellExtent)
				const max = min.dup().add(this.cellExtent)
				return new Cell(new Rect(min, max))
			})
		}
	}
}

class Cell<X> {
	items = new Set<X>()
	constructor(public rect: Rect) {}
}

function hash({x, y}: Xy) {
	return `${x},${y}`
}

function cellIndex(point: Xy, cellExtent: Xy) {
	return new Vec2(
		Math.floor(point.x / cellExtent.x),
		Math.floor(point.y / cellExtent.y),
	)
}

function maxCellIndex(min: number, max: number, extent: number) {
	return (max <= min)
		? Math.floor(min / extent)
		: Math.ceil(max / extent) - 1
}

