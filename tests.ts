import { Interval, IntervalNode } from "./rangetree";

const baseTree = () => {
    const root = new IntervalNode(null, null, new Interval(20, 30))
    root.leftNode = new IntervalNode(null, null, new Interval(0, 10))
    root.rightNode = new IntervalNode(null, null, new Interval(50, 70))
    return root
}

const doQuery = (a: number, b: number) => {
    let tree = baseTree()
    console.log(`insert[${a}, ${b}]: `)
    const gaps = tree.insert(new Interval(a, b))
    console.log(`returned: ${gaps}`)
}

doQuery(12, 17)
doQuery(5, 17)
doQuery(25, 28)
doQuery(15, 35)
doQuery(0, 100)
