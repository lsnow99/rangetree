export class Interval {
	minVal: number;
	maxVal: number;

	constructor(minVal: number, maxVal: number) {
		this.minVal = minVal
		this.maxVal = maxVal
	}

	contains(x: number) {
		return this.minVal <= x && this.maxVal >= x;
	}

	// Requires overlapping intervals
	absorb(interval: Interval) {
		this.minVal = Math.min(interval.minVal, this.minVal)
		this.maxVal = Math.max(interval.maxVal, this.maxVal)
	}

	toString() {
		return `[${this.minVal}, ${this.maxVal}]`
	}
}

export class IntervalNode {
	interval: Interval
	leftNode: IntervalNode | null;
	rightNode: IntervalNode | null;

	constructor(leftNode: IntervalNode | null, rightNode: IntervalNode | null, interval: Interval) {
		this.leftNode = leftNode;
		this.rightNode = rightNode;
		this.interval = interval
	}

	contains(x: number): boolean {
		if (x < this.interval.minVal) {
			return this.leftNode?.contains(x) ?? false
		} else if (x > this.interval.maxVal) {
			return this.rightNode?.contains(x) ?? false
		}
		return true
	}

	insert(interval: Interval): Interval[] {
		// Case 1
		if (interval.minVal >= this.interval.minVal && interval.maxVal <= this.interval.maxVal) {
			return []
		// Case 4
		} else if (interval.minVal < this.interval.minVal && interval.maxVal > this.interval.maxVal) {
			const newLeftInterval = new Interval(interval.minVal, this.interval.minVal)
			const newRightInterval = new Interval(this.interval.maxVal, interval.maxVal)

			const leftResults = this.leftNode?.insert(newLeftInterval)
			const coalescedLeftResults = leftResults ? leftResults : [newLeftInterval]

			const rightResults = this.rightNode?.insert(newRightInterval)
			const coalescedRightResults = rightResults ? rightResults : [newRightInterval]

			return [...coalescedLeftResults, ...coalescedRightResults]
		// Case 6
		} else if (interval.minVal <= this.interval.minVal && interval.maxVal <= this.interval.minVal) {
			return this.leftNode?.insert(interval) ?? [interval]
		// Case 5
		} else if (interval.maxVal >= this.interval.maxVal && interval.minVal >= this.interval.maxVal) {
			return this.rightNode?.insert(interval) ?? [interval]
		// Case 2
		} else if (interval.minVal >= this.interval.minVal && interval.maxVal >= this.interval.maxVal) {
			const newInterval = new Interval(this.interval.maxVal, interval.maxVal)
			return this.leftNode?.insert(newInterval) ?? [newInterval]
		// Case 3
		} else if (interval.maxVal <= this.interval.maxVal && interval.minVal <= this.interval.minVal) {
			const newInterval = new Interval(interval.minVal, this.interval.minVal)
			return this.rightNode?.insert(newInterval) ?? [newInterval]
		}
		throw(`unhandled case, requested interval: ${interval}, current node interval: ${this.interval}`)
	}
}
