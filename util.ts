// Printing debug code borrowed from geeks for geeks
import { IntervalNode } from "rangetree";

const COUNT = 10;
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
