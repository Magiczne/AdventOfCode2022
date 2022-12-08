import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

const directions = ['top', 'right', 'bottom', 'left'] as const

type Tree = { x: number, y: number, height: number }
type Forest = ReadonlyArray<Tree>
type Direction = (typeof directions)[number]

// x = 0, y = 0 is at top left
const buildForest = (file: string): Forest => {
  return readFileSync(resolve(__dirname, file))
    .toString()
    .trim()
    .split('\n')
    .map((row, y): Array<Tree> => {
      return row
        .split('')
        .map((height, x): Tree => {
          return {
            x,
            y,
            height: parseInt(height, 10)
          }
        })
    })
    .flat()
}

const findTreesInDirection = ({ x, y }: Tree, direction: Direction, forest: Forest): Array<Tree> => {
  switch (direction) {
    case "top":
      // Why do I need to reverse that? :p
      return forest.filter(tree => tree.x === x && tree.y < y).reverse()

    case "right":
      return forest.filter(tree => tree.x > x && tree.y === y)

    case "bottom":
      return forest.filter(tree => tree.x === x && tree.y > y)

    case "left":
      return forest.filter(tree => tree.x < x && tree.y === y).reverse()
  }
}

const visibleInDirection = (tree: Tree, direction: Direction, forest: Forest): boolean => {
  return findTreesInDirection(tree, direction, forest).every(otherTree => {
    return otherTree.height < tree.height
  })
}

const countVisibleFromEdges = (file: string): number => {
  const forest = buildForest(file)

  return forest.filter(tree => {
    return (
      visibleInDirection(tree, 'top', forest) ||
      visibleInDirection(tree, 'right', forest) ||
      visibleInDirection(tree, 'bottom', forest) ||
      visibleInDirection(tree, 'left', forest)
    )
  }).length
}

const calculateScenicScore = (file: string): number => {
  const forest = buildForest(file)

  const scores = forest
    .map(tree => {
      return directions
        .map(direction => {
          let score = 0
          const treesInDirection = findTreesInDirection(tree, direction, forest)

          for (const treeInDirection of treesInDirection) {
            score++

            if (treeInDirection.height >= tree.height) {
              break;
            }
          }

          return score
        })
        .reduce<number>((acc, directionScore) => acc * directionScore, 1)
    })

  return Math.max(...scores)
}

solutionExample(countVisibleFromEdges('example.txt'))
solutionPart1(countVisibleFromEdges('input.txt'))

solutionExample(calculateScenicScore('example.txt'))
solutionPart2(calculateScenicScore('input.txt'))
