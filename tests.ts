import { Interval, IntervalNode, print2DUtil } from "./rangetree";

const baseTree = () => {
  const root = new IntervalNode(null, null, new Interval(20, 30));
//   root.leftNode = new IntervalNode(null, null, new Interval(0, 10));
  root.rightNode = new IntervalNode(null, null, new Interval(50, 70));
  return root;
};

const doQuery = (tree: IntervalNode, a: number, b: number): IntervalNode => {
    console.log(`insert[${a}, ${b}]: `)
    const returned = tree.insert(new Interval(a, b))
    console.log(`returned: ${returned.gaps}`)
    return tree
}

let bTree = baseTree();
console.log("=============================");
print2DUtil(bTree);
doQuery(bTree, 25, 35);
console.log("=============================");
print2DUtil(bTree);
doQuery(bTree, -5, 30);
console.log("=============================");
print2DUtil(bTree);
doQuery(bTree, -10, 40);
console.log("=============================");
print2DUtil(bTree);
doQuery(bTree, -100, 100);
console.log("=============================");
print2DUtil(bTree);


console.log("=============================");
console.log("=============================");

bTree = baseTree()
console.log("=============================");
print2DUtil(bTree);

doQuery(bTree, 110, 120);
console.log("=============================");
print2DUtil(bTree);

doQuery(bTree, -50, -30);
console.log("=============================");
print2DUtil(bTree);

doQuery(bTree, 12, 17);
console.log("=============================");
print2DUtil(bTree);

doQuery(bTree, -100, 110);
console.log("=============================");
print2DUtil(bTree);
