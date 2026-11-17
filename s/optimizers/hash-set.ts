
export class HashSet<Value> {
	#map = new Map<string, Value>

	constructor(
			private hash: (value: Value) => string,
			values: Value[] = [],
		) {
		for (const value of values)
			this.add(value)
	}

	get size() {
		return this.#map.size
	}

	get(value: Value) {
		return this.#map.get(this.hash(value))
	}

	has(value: Value) {
		return this.#map.has(this.hash(value))
	}

	add(value: Value) {
		const key = this.hash(value)
		if (this.#map.has(key))
			return this.#map.get(key)!
		else {
			this.#map.set(key, value)
			return value
		}
	}

	delete(...values: Value[]) {
		for (const value of values)
			this.#map.delete(this.hash(value))
		return this
	}

	array() {
		return [...this.#map.values()]
	}

	values() {
		return this.#map.values()
	}

	[Symbol.iterator]() {
		return this.values()
	}
}

