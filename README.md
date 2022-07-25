# RangeTree

A range tree is a data structure that stores queries for ranges, such as those along a line of integers.

## Repository Initialization

1. Clone the repository
2. `npm install`

To run tests defined in `tests.ts`, do `npm test`

## Definition

Definition: Suppose a range tree $\texttt{rt}$ contains the set $S$ of ranges where $S = \\{ [a^1_\text{low}, a^1_\text{high}], [a^2_\text{low}, a^2_\text{high}], \ldots \\} $, where for all $(i, j) \in [1, |S|]$ where $(i \neq j)$, it is true that $S_i \cap S_j = \varnothing$. In other words, all the ranges within $S$ are non-overlapping.

`rt` must support the operation `insert([x, y])`:

define $S^{xy}$ such that $\forall i \in [1, |S^{xy}|]$ it is true that $S_i^{xy} \in S$ and $S_i^{xy} \cap [x, y] \neq \varnothing$. In other words, $S^{xy}$ is the set of all elements within $S$ that have overlap with the requested range $[x, y]$.

define `insert` such that `insert([x, y])` returns set $G$ of ranges such that $[x, y] = G \cup S^{xy}$, where $G \cap S = \varnothing$. Also, after insert, $S = (S \setminus S^{xy}) \cup \\{a, b\\}$ where $a$ is the lowest bound of all ranges in $G \cup S^{xy}$, and $b$ is the greatest bound of all ranges in $G \cup S^{xy}$. 

## Examples
Suppose the range tree currently holds the following intervals of integers before running each of the below queries: {[0, 10], [20, 30], [50, 70]}.

- Query 1: `insert([12, 17])` -> should return {[12, 17]} since this interval has no overlap in the range tree. The range tree now contains {[0, 10], [20, 30], [50, 70], [12, 17]}
- Query 2: `insert([5, 17])` -> should return {[10, 17]} since this interval is the gap that is needed to fulfill the query. The range tree now contains {[0, 17], [20, 30], [50, 70]}
- Query 3: `insert([25, 28])` -> should return {} (empty list) since the interval is already fully contained in the data structure. The range tree now contains {[0, 10], [20, 30], [50, 70]}
- Query 4: `insert([15, 35])` -> should return {[15, 20], [30, 35]} since both these intervals are needed to fulfill the query. The range tree now contains {[0, 10], [15, 35], [50, 70]}
- Query 5: `insert([0, 100])` -> should return {[10, 20], [30, 50], [70, 100]}. The range tree now contains {[0, 100]}

To run these examples, do `npm test`
