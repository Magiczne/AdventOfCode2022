import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { max } from 'radash'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

type Point = { x: number, y: number, z: number }
type Grid = Array<Array<Array<boolean>>>

const directions: ReadonlyArray<Point> = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 }
]

const readPoints = (file: string): Array<Point> => {
  return readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .map(line => {
      const point = line
        .split(',')
        .map(coordinate => parseInt(coordinate, 10))

      return {
        x: point[0],
        y: point[1],
        z: point[2]
      }
    })
}

const getNeighbors = ({ x, y, z }: Point): Array<Point> => {
  return directions.map(direction => {
    return {
      x: x + direction.x,
      y: y + direction.y,
      z: z + direction.z
    }
  })
}

const countEmptyNeighbors = (point: Point, grid: Grid): number => {
  return getNeighbors(point)
    .map(neighbor => grid[neighbor.x]?.[neighbor.y]?.[neighbor.z])
    .filter(neighbor => neighbor !== true)
    .length
}

const isAirPocket = (point: Point, grid: Grid): boolean => {
  if (grid[point.x]?.[point.y]?.[point.z] === true) {
    return false
  }

  return getNeighbors(point)
    .map(neighbor => grid[neighbor.x]?.[neighbor.y]?.[neighbor.z])
    .every(neighbor => neighbor === true)
}

const createGrid = (points: Array<Point>) => {
  const maxX = max(points, point => point.x)!.x
  const maxY = max(points, point => point.y)!.y
  const maxZ = max(points, point => point.z)!.z

  const grid: Grid = Array.from({ length: maxX + 1 }, (): Array<Array<boolean>> => {
    return Array.from({ length: maxY + 1 }, (): Array<boolean> => {
      return Array.from({ length: maxZ + 1 }, (): boolean => false)
    })
  })

  points.forEach(point => {
    grid[point.x][point.y][point.z] = true
  })

  return grid
}

const countAirPockets = (grid: Grid): number => {
  let counter = 0

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      for (let z = 0; z < grid[x][y].length; z++) {
        if (isAirPocket({ x, y, z }, grid)) {
          console.log({ x, y, z }, 'is an air pocket')
          counter++
        }
      }
    }
  }

  return counter
}

const calculateSurfaceArea = (file: string): number => {
  const points = readPoints(file)
  const grid = createGrid(points)

  return points.reduce<number>((acc, point) => {
    return acc + countEmptyNeighbors(point, grid)
  }, 0)
}

const calculateOutsideSurfaceArea = (file: string): number => {
  const points = readPoints(file)
  const grid = createGrid(points)
  const airPockets = countAirPockets(grid)

  console.log(airPockets)

  return points.reduce<number>((acc, point) => {
    return acc + countEmptyNeighbors(point, grid)
  }, 0) - airPockets * 6
}

// solutionExample(calculateSurfaceArea('example.txt'))
// solutionPart1(calculateSurfaceArea('input.txt'))

solutionExample(calculateOutsideSurfaceArea('example.txt'))
solutionPart2(calculateOutsideSurfaceArea('input.txt'))
