
import {guarantee} from "@e280/stz"
import {Vec2} from "../core/vec2.js"
import {Rect} from "../shapes/2d/rect.js"
import {collideRectVsRect} from "../physics/2d/collide.js"

export class Zen<X> {
	zones = new Set<ZenZone<X>>()

	constructor(
		public grid: ZenGrid<X>,
		public rect: Rect,
		public item: X,
	) {}

	update() {
		this.grid.update(this)
	}

	delete() {
		this.grid.delete(this)
	}
}

export class ZenZone<X> {
	rect: Rect
	zens = new Set<Zen<X>>()

	constructor(public hash: string, center: Vec2, size: Vec2) {
		this.rect = Rect.fromCenter(center, size)
	}
}

export class ZenGrid<X> {
	#zones = new Map<string, ZenZone<X>>()

	constructor(private zoneExtent: Vec2) {}

	count() {
		let n = 0
		for (const zone of this.#zones.values())
			n += zone.zens.size
		return n
	}

	create(rect: Rect, item: X) {
		const zen = new Zen<X>(this, rect, item)
		this.update(zen)
		return zen
	}

	update(zen: Zen<X>) {
		const wantedZones = this.#selectZones(zen.rect)

		// delete stale zones
		for (const zone of zen.zones) {
			if (!wantedZones.has(zone)) {
				zen.zones.delete(zone)
				zone.zens.delete(zen)
			}
		}

		// add fresh zones
		for (const zone of wantedZones) {
			if (!zen.zones.has(zone)) {
				zone.zens.add(zen)
				zen.zones.add(zone)
			}
		}
	}

	delete(zen: Zen<X>) {
		const emptyZones: ZenZone<X>[] = []

		for (const zone of zen.zones) {
			zone.zens.delete(zen)
			if (zone.zens.size === 0)
				emptyZones.push(zone)
		}

		for (const emptyZone of emptyZones)
			this.#zones.delete(emptyZone.hash)
	}

	check(rect: Rect) {
		const zones = this.#selectZones(rect)

		for (const zone of zones)
			for (const zen of zone.zens)
				if (collideRectVsRect(rect, zen.rect))
					return true

		return false
	}

	/** return set of zens that touch the given rect */
	query(rect: Rect) {
		const zones = this.#selectZones(rect)
		const selected = new Set<Zen<X>>()

		for (const zone of zones)
			for (const zen of zone.zens)
				if (!selected.has(zen) && collideRectVsRect(rect, zen.rect))
					selected.add(zen)

		return selected
	}

	/** return all zen items that touch the given rect */
	queryItems(rect: Rect) {
		return [...this.query(rect)].map(zen => zen.item)
	}

	/** return all zen rects that touch the given rect */
	queryRects(rect: Rect) {
		return [...this.query(rect)].map(zen => zen.rect)
	}

	#hash(v: Vec2) {
		return `${v.x},${v.y}`
	}

	#calculateZoneCorner(point: Vec2) {
		return new Vec2(
			Math.floor(point.x / this.zoneExtent.x),
			Math.floor(point.y / this.zoneExtent.y),
		).mul(this.zoneExtent)
	}

	#obtainZone(zoneCorner: Vec2) {
		const hash = this.#hash(zoneCorner)
		return guarantee(this.#zones, hash, () => new ZenZone(
			hash,
			zoneCorner.dup().add(this.zoneExtent.dup().half()),
			this.zoneExtent,
		))
	}

	#selectZones(rect: Rect) {
		const zones = new Set<ZenZone<X>>()
		const minZoneCorner = this.#calculateZoneCorner(rect.min)
		const maxZoneCorner = this.#calculateZoneCorner(rect.max)

		for (let x = minZoneCorner.x; x <= maxZoneCorner.x; x += this.zoneExtent.x)
			for (let y = minZoneCorner.y; y <= maxZoneCorner.y; y += this.zoneExtent.y)
				zones.add(this.#obtainZone(new Vec2(x, y)))

		return zones
	}
}

