export class Interval {
  minVal: number;
  maxVal: number;

  constructor(minVal: number, maxVal: number) {
    if (minVal > maxVal) {
      throw `min val > max val: ${minVal} > ${maxVal}`;
    }
    this.minVal = minVal;
    this.maxVal = maxVal;
  }

  toString() {
    return `[${this.minVal}, ${this.maxVal}]`;
  }
}

enum ComingFrom {
  Left = "left",
  Right = "right",
  None = "",
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

interface IntervalArgsWithInterval {
  interval: Interval;
  a?: never;
  b?: never;
}

interface IntervalArgsWithBounds {
  a: number;
  b: number;
  interval?: never;
}

export type IntervalArgs = IntervalArgsWithInterval | IntervalArgsWithBounds;

export class IntervalNode {
  interval: Interval;
  leftNode: IntervalNode | null = null;
  rightNode: IntervalNode | null = null;

  constructor({ interval, a, b }: IntervalArgs) {
    this.interval = interval ?? new Interval(a, b);
  }

  insert(
    { interval, a, b }: IntervalArgs,
    comingFrom = ComingFrom.None
  ): InsertResult {
    let nodeCase: Case;
    let gaps: Interval[] = [];
    interval = interval ?? new Interval(a, b);
    // Case 1
    if (
      interval.minVal >= this.interval.minVal &&
      interval.maxVal <= this.interval.maxVal
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
      interval.minVal < this.interval.minVal &&
      interval.maxVal < this.interval.minVal
    ) {
      nodeCase = Case.Six;
      // Case 5
    } else if (
      interval.maxVal > this.interval.maxVal &&
      interval.minVal > this.interval.maxVal
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
      const result = this.leftNode?.insert(
        { interval: newInterval },
        ComingFrom.Right
      );
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
        this.interval.minVal = interval.minVal;
      }
      gaps = [...gaps, ...coalescedResults];
    }

    if (nodeCase === Case.Two || nodeCase === Case.Four) {
      const newInterval = new Interval(this.interval.maxVal, interval.maxVal);
      const result = this.rightNode?.insert(
        { interval: newInterval },
        ComingFrom.Left
      );
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
        this.interval.maxVal = interval.maxVal;
      }
      gaps = [...gaps, ...coalescedResults];
    }

    if (nodeCase === Case.Five) {
      const result = this.rightNode?.insert({ interval }, comingFrom);
      const coalescedResults = result?.gaps ?? [interval];

      if (!result && comingFrom !== ComingFrom.Right) {
        this.rightNode = new IntervalNode({ interval });
      } else if (
        result &&
        comingFrom === ComingFrom.Right &&
        result.case !== Case.Five
      ) {
        this.rightNode = null;
      }
      gaps = coalescedResults;
    } else if (nodeCase === Case.Six) {
      const result = this.leftNode?.insert({ interval }, comingFrom);
      const coalescedResults = result?.gaps ?? [interval];

      if (!result && comingFrom !== ComingFrom.Left) {
        this.leftNode = new IntervalNode({ interval });
      } else if (
        result &&
        comingFrom === ComingFrom.Left &&
        result.case !== Case.Six
      ) {
        this.leftNode = null;
      }
      gaps = coalescedResults;
    }

    return { case: nodeCase, gaps, furthest: this };
  }
}
