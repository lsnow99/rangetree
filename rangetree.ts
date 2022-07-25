export class Interval {
  minVal: number;
  maxVal: number;

  constructor(minVal: number, maxVal: number) {
    this.minVal = minVal;
    this.maxVal = maxVal;
  }

  contains(x: number) {
    return this.minVal <= x && this.maxVal >= x;
  }

  toString() {
    return `[${this.minVal}, ${this.maxVal}]`;
  }
}

enum ComingFrom {
	Left = "left",
	Right = "right",
	None = ""
}

enum Case {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
}

type InsertResult = {
  gaps: Interval[];
  furthest: IntervalNode;
  case: Case;
};

export class IntervalNode {
  interval: Interval;
  leftNode: IntervalNode | null;
  rightNode: IntervalNode | null;

  constructor(
    leftNode: IntervalNode | null,
    rightNode: IntervalNode | null,
    interval: Interval
  ) {
    this.leftNode = leftNode;
    this.rightNode = rightNode;
    this.interval = interval;
  }

  contains(x: number): boolean {
    if (x < this.interval.minVal) {
      return this.leftNode?.contains(x) ?? false;
    } else if (x > this.interval.maxVal) {
      return this.rightNode?.contains(x) ?? false;
    }
    return true;
  }

  insert(interval: Interval, comingFrom=ComingFrom.None): InsertResult {
    let nodeCase: Case;
    let gaps: Interval[] = [];
    // Case 1
    if (
      interval.minVal >= this.interval.minVal &&
      interval.maxVal < this.interval.maxVal
    ) {
      nodeCase = Case.One;
      // Case 4
    } else if (
      interval.minVal <= this.interval.minVal &&
      interval.maxVal > this.interval.maxVal
    ) {
      nodeCase = Case.Four;
      // Case 6
    } else if (
      interval.minVal <= this.interval.minVal &&
      interval.maxVal < this.interval.minVal
    ) {
      nodeCase = Case.Six;
      // Case 5
    } else if (
      interval.maxVal > this.interval.maxVal &&
      interval.minVal >= this.interval.maxVal
    ) {
      nodeCase = Case.Five;
      // Case 2
    } else if (
      interval.minVal >= this.interval.minVal &&
      interval.maxVal > this.interval.maxVal
    ) {
      nodeCase = Case.Two;
      // Case 3
    } else if (
      interval.maxVal < this.interval.maxVal &&
      interval.minVal <= this.interval.minVal
    ) {
      nodeCase = Case.Three;
    } else {
      throw `unhandled case, requested interval: ${interval}, current node interval: ${this.interval}`;
    }

    if (nodeCase === Case.Three || nodeCase === Case.Four) {
      const newInterval = new Interval(interval.minVal, this.interval.minVal);
      const result = this.leftNode?.insert(newInterval, ComingFrom.Right);
      const coalescedResults = result?.gaps ?? [newInterval];

      if (result) {
        if (result.case === Case.Two) {
          this.interval.minVal = result.furthest.interval.minVal;
        } else {
          this.interval.minVal = interval.minVal;
        }

        if (result.case === Case.Five) {
          this.leftNode = result.furthest;
        } else if (result.case === Case.Four || result.case === Case.Two) {
          this.leftNode = result.furthest.leftNode;
        }
      } else {
		this.interval.minVal = interval.minVal
	  }
      gaps = [...gaps, ...coalescedResults];
    }

    if (nodeCase === Case.Two || nodeCase === Case.Four) {
      const newInterval = new Interval(this.interval.maxVal, interval.maxVal);
      const result = this.rightNode?.insert(newInterval, ComingFrom.Left);
      const coalescedResults = result?.gaps ?? [newInterval];

      if (result) {
        if (result.case === Case.Three) {
          this.interval.maxVal = result.furthest.interval.maxVal;
        } else {
          this.interval.maxVal = interval.maxVal;
        }

        if (result.case === Case.Six) {
          this.rightNode = result.furthest;
        } else if (result.case === Case.Four || result.case === Case.Three) {
          this.rightNode = result.furthest.rightNode;
        }
      } else {
		this.interval.maxVal = interval.maxVal
	  }
      gaps = [...gaps, ...coalescedResults];
    }

    if (nodeCase === Case.Five) {
      const result = this.rightNode?.insert(interval, comingFrom)
	  const coalescedResults = result?.gaps ?? [interval]

	  if (!result && comingFrom !== ComingFrom.Right) {
		this.rightNode = new IntervalNode(null, null, interval)
	  }
	  gaps = coalescedResults
    } else if (nodeCase === Case.Six) {
		const result = this.leftNode?.insert(interval, comingFrom)
		const coalescedResults = result?.gaps ?? [interval]
  
		if (!result && comingFrom !== ComingFrom.Left) {
		  this.leftNode = new IntervalNode(null, null, interval)
		}
		gaps = coalescedResults
    }

    return { case: nodeCase, gaps, furthest: this };
  }
}


// Printing debug code borrowed from geeks for geeks

let COUNT = 10;
// Function to print binary tree in 2D
// It does reverse inorder traversal
export const print2DUtil = (
  root: IntervalNode | null,
  space = 0,
  count = COUNT
) => {
  // Base case
  if (root === null) return;

  // Increase distance between levels
  space += count;

  // Process right child first
  print2DUtil(root.rightNode, space);

  // Print current node after space
  // count
  process.stdout.write("\n");
  for (let i = count; i < space; i++) process.stdout.write("  ");
  process.stdout.write(String(root.interval).padStart(8) + "\n");

  // Process left child
  print2DUtil(root.leftNode, space);
};
