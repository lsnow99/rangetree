import { Interval, IntervalArgs, IntervalNode } from "./rangetree";
import { describe, expect, it } from "vitest";
import { fuzz, preset } from "fuzzing";

const verifyTrees = (testRoot: IntervalNode, expRoot: IntervalNode) => {
  expect(testRoot.interval.minVal).toBe(expRoot.interval.minVal);
  expect(testRoot.interval.maxVal).toBe(expRoot.interval.maxVal);
  if (expRoot.leftNode !== null) {
    expect(testRoot.leftNode).not.toBeNull();
    verifyTrees(testRoot.leftNode!, expRoot.leftNode);
  } else {
    expect(testRoot.leftNode).toBeNull();
  }
  if (expRoot.rightNode !== null) {
    expect(testRoot.rightNode).not.toBeNull();
    verifyTrees(testRoot.rightNode!, expRoot.rightNode);
  } else {
    expect(testRoot.rightNode).toBeNull();
  }
};

const doInsertBuilder =
  (testRoot: IntervalNode, expRoot: IntervalNode) =>
  (args: IntervalArgs, expectedResult: string) => {
    expect(String(testRoot.insert(args).gaps)).toBe(expectedResult);

    verifyTrees(testRoot, expRoot);
  };

const buildBasicTree = (): [
  IntervalNode,
  IntervalNode,
  ReturnType<typeof doInsertBuilder>
] => {
  const rootBounds = { a: 0, b: 10 };
  const expTree = new IntervalNode(rootBounds);
  const root = new IntervalNode(rootBounds);
  const doInsert = doInsertBuilder(root, expTree);

  expTree.interval.minVal = -5;
  expTree.interval.maxVal = 15;
  doInsert(
    { a: -5, b: 15 },
    String([new Interval(-5, 0), new Interval(10, 15)])
  );

  doInsert({ a: -5, b: 15 }, String([]));

  doInsert({ a: -3, b: 3 }, String([]));

  expTree.rightNode = new IntervalNode({ a: 25, b: 30 });
  doInsert({ a: 25, b: 30 }, String([new Interval(25, 30)]));

  expTree.rightNode.rightNode = new IntervalNode({ a: 50, b: 75 });
  doInsert({ a: 50, b: 75 }, String([new Interval(50, 75)]));

  return [root, expTree, doInsert];
};

const buildFull3LayerTree = (): ReturnType<typeof buildBasicTree> => {
  const [root, expTree, doInsert] = buildBasicTree();

  expTree.leftNode = new IntervalNode({ a: -30, b: -20 });
  doInsert({ a: -30, b: -20 }, String([new Interval(-30, -20)]));

  expTree.leftNode.rightNode = new IntervalNode({ a: -17, b: -10 });
  doInsert({ a: -17, b: -10 }, String([new Interval(-17, -10)]));

  expTree.leftNode.leftNode = new IntervalNode({ a: -60, b: -45 });
  doInsert({ a: -60, b: -45 }, String([new Interval(-60, -45)]));

  expTree.rightNode!.leftNode = new IntervalNode({ a: 17, b: 18 });
  doInsert({ a: 17, b: 18 }, String([new Interval(17, 18)]));

  return [root, expTree, doInsert];
};

describe("Interval Basic", () => {
  it.concurrent("Regular construction", () => {
    const interval = new Interval(-10, 82);
    expect(interval.minVal).toBe(-10);
    expect(interval.maxVal).toBe(82);
  });
  it.concurrent("Bad input", () => {
    expect(() => {
      new Interval(82, -10);
    }).toThrowError();
  });
  it.concurrent("Less than out of bounds", () => {});
});

describe.concurrent("Basic", () => {
  it.concurrent("Build a few nodes and combine them all", () => {
    const [_root, expTree, doInsert] = buildBasicTree();

    expTree.leftNode = null;
    expTree.rightNode = null;
    expTree.interval.minVal = -100;
    expTree.interval.maxVal = 100;
    doInsert(
      { a: -100, b: 100 },
      String([
        new Interval(-100, -5),
        new Interval(15, 25),
        new Interval(30, 50),
        new Interval(75, 100),
      ])
    );
  });
  it.concurrent("Build a full tree 3 layers deep and combine one half", () => {
    const [_root, expTree, doInsert] = buildFull3LayerTree();

    expTree.interval.maxVal = 500;
    expTree.rightNode = null;
    doInsert(
      { a: 5, b: 500 },
      String([
        new Interval(15, 17),
        new Interval(18, 25),
        new Interval(30, 50),
        new Interval(75, 500),
      ])
    );
  });
  it.concurrent("Build a full tree 3 layers deep and combine a subtree", () => {
    const [_root, expTree, doInsert] = buildFull3LayerTree();

    expTree.rightNode!.interval.minVal = 16;
    expTree.rightNode!.interval.maxVal = 500;
    expTree.rightNode!.rightNode = null;
    expTree.rightNode!.leftNode = null;
    doInsert(
      { a: 16, b: 500 },
      String([
        new Interval(16, 17),
        new Interval(18, 25),
        new Interval(30, 50),
        new Interval(75, 500),
      ])
    );
  });
  it.concurrent("Case 2", () => {
    const [_root, expTree, doInsert] = buildFull3LayerTree();
    expTree.interval.maxVal = 30;
    expTree.rightNode = expTree.rightNode!.rightNode;
    doInsert(
      {
        a: 10,
        b: 27,
      },
      String([new Interval(15, 17), new Interval(18, 25)])
    );
  });
  it.concurrent("Case 3 -> Case 2", () => {
    const [_root, expTree, doInsert] = buildFull3LayerTree();
    expTree.interval.minVal = -30;
    expTree.leftNode = expTree.leftNode!.leftNode;
    doInsert(
      {
        a: -25,
        b: 10,
      },
      String([new Interval(-20, -17), new Interval(-10, -5)])
    );
  });
  it.concurrent("Case 3 -> Case 5", () => {
    const [_root, expTree, doInsert] = buildFull3LayerTree();
    expTree.interval.minVal = -8;
    doInsert(
      {
        a: -8,
        b: -3,
      },
      String([new Interval(-8, -5)])
    );
  });

  it.concurrent("Another Case 3 -> Case 5", () => {
    const [_root, expTree, doInsert] = buildFull3LayerTree();
    expTree.interval.minVal = -19;
    expTree.leftNode!.rightNode = null;
    doInsert(
      {
        a: -19,
        b: -3,
      },
      String([new Interval(-19, -17), new Interval(-10, -5)])
    );
  });

  it.concurrent("Case 2 -> Case 6", () => {
    const [_root, expTree, doInsert] = buildFull3LayerTree();
    expTree.interval.maxVal = 20;
    expTree.rightNode!.leftNode = null;
    doInsert(
      {
        a: 10,
        b: 20,
      },
      String([new Interval(15, 17), new Interval(18, 20)])
    );
  });
});

describe.concurrent("Bound edges", () => {
  it.concurrent("Test maxval matching root minval", () => {
    const [_root, expTree, doInsert] = buildBasicTree();

    expTree.interval.minVal = -20;
    expTree.interval.maxVal = 15;
    doInsert({ a: -20, b: -5 }, String([new Interval(-20, -5)]));
  });

  it.concurrent("Test minval matching root maxval", () => {
    const [_root, expTree, doInsert] = buildBasicTree();

    expTree.interval.minVal = -5;
    expTree.interval.maxVal = 30;
    expTree.rightNode = expTree.rightNode!.rightNode;
    doInsert({ a: 15, b: 29 }, String([new Interval(15, 25)]));
  });
});

describe.concurrent("Infinities", () => {
  it.concurrent("Negative to positive infinity base", () => {
    const [_root, expTree, doInsert] = buildBasicTree();

    expTree.leftNode = null;
    expTree.rightNode = null;
    expTree.interval.minVal = -Infinity;
    expTree.interval.maxVal = Infinity;
    doInsert(
      { a: -Infinity, b: Infinity },
      String([
        new Interval(-Infinity, -5),
        new Interval(15, 25),
        new Interval(30, 50),
        new Interval(75, Infinity),
      ])
    );
    doInsert({ a: 1, b: 2 }, String([]));
    doInsert({ a: 1, b: Infinity }, String([]));
  });
});

describe.concurrent("Fuzz", () => {
  it.concurrent("Basic fuzz test", async () => {
    // This test keeps using the same tree for every insert, but that quickly turns our tree into [-Infinity, Infinity)
    const [tree] = buildBasicTree();
    const doFuzz = (a: number, b: number) => {
      if (a <= b) tree.insert({ a, b });
    };
    const errors = await fuzz(doFuzz)
      .under(preset.number(), preset.number())
      .errors();
    expect(errors).toEqual([]);
  });

  it.concurrent("Basic fuzz test", async () => {
    // This test uses a new tree for every insert
    const doFuzz = (a: number, b: number) => {
      const [tree] = buildBasicTree();
      if (a <= b) tree.insert({ a, b });
    };
    const errors = await fuzz(doFuzz)
      .under(preset.number(), preset.number())
      .errors();
    expect(errors).toEqual([]);
  });
});
