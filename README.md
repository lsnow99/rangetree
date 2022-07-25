# RangeTree

A range tree is a data structure that stores queries for ranges, such as those along a line of integers.

## Repository Initialization

1. Clone the repository
2. `npm install`

To run tests defined in `tests.ts`, do `npm test`

## Definition

Definition: Suppose a range tree `rt` contains the set S of ranges where S = {[a<sup>1</sup><sub>low</sub>, a<sup>1</sup><sub>high</sub>], [a<sup>2</sup><sub>low</sub>, a<sup>2</sup><sub>high</sub>], ....}, where for all (i, j)∈[1, |S|] where (i ≠ j), it is true that S<sub>i</sub>∩S<sub>j</sub>=∅. In other words, all the ranges within S are non-overlapping.

`rt` must support the operation `insert([x, y])`:

define S<sup>xy</sup> such that ∀(i) where i∈[1, |S<sup>xy</sup>|] it is true that S<sub>i</sub><sup>xy</sup>∈S and S<sub>i</sub><sup>xy</sup>∩[x, y] ≠ ∅. In other words, S<sup>xy</sup> is the set of all elements within S that have overlap with the requested range [x, y].

define `insert` such that `insert([x, y])` returns set G of ranges such that [x, y] = G∪S<sup>xy</sup>, where G∩S = ∅. Also, after insert S = (S\S<sup>xy</sup>)∪{a, b} where a is the lowest bound of all ranges in G∪S<sup>xy</sup>, and b is the greatest bound of all ranges in G∪S<sup>xy</sup>. 

## Examples
Suppose the range tree currently holds the following intervals of integers before running each of the below queries: {[0, 10], [20, 30], [50, 70]}.

- Query 1: `insert([12, 17])` -> should return {[12, 17]} since this interval has no overlap in the range tree. The range tree now contains {[0, 10], [20, 30], [50, 70], [12, 17]}
- Query 2: `insert([5, 17])` -> should return {[10, 17]} since this interval is the gap that is needed to fulfill the query. The range tree now contains {[0, 17], [20, 30], [50, 70]}
- Query 3: `insert([25, 28])` -> should return {} (empty list) since the interval is already fully contained in the data structure. The range tree now contains {[0, 10], [20, 30], [50, 70]}
- Query 4: `insert([15, 35])` -> should return {[15, 20], [30, 35]} since both these intervals are needed to fulfill the query. The range tree now contains {[0, 10], [15, 35], [50, 70]}
- Query 5: `insert([0, 100])` -> should return {[10, 20], [30, 50], [70, 100]}. The range tree now contains {[0, 100]}

To run these examples, do `npm test`

## Proof

When performing an insert, we can consider the following cases at any given node of the tree:

Suppose the node has an interval given by [a, b] and we are inserting [x, y]

There are 6 cases:

- Case 1: ---(---[---]---)---
- Case 2: ---(---[---)---]---
- Case 3: ---[---(---]---)---
- Case 4: ---[---(---)---]---
- Case 5: ---(---)---[---]---
- Case 6: ---[---]---(---)---

For coalescing:
- Case 1: No coalescing performed
- Case 2: Our node becomes [a, y]
- Case 3: Our node becomes [x, b]
- Case 4: Our node becomes [x, y]
- Case 5: Our node stays the same
- Case 6: Our node stays the same

Correctness
