import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { max } from 'radash'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

const enum CellType {
  Nothing = 'N',
  Lava = 'L',
  Water = 'W'
}

type Point = { x: number, y: number, z: number }
type Grid = Array<Array<Array<CellType>>>

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

      // Moving every coordinate by 1 for flood fill to work correctly
      return {
        x: point[0] + 1,
        y: point[1] + 1,
        z: point[2] + 1
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
    .map(neighbor => grid[neighbor.x]?.[neighbor.y]?.[neighbor.z] ?? CellType.Nothing)
    .filter(neighbor => neighbor !== CellType.Lava)
    .length
}

const countWaterNeighbors = (point: Point, grid: Grid): number => {
  return getNeighbors(point)
    .map(neighbor => grid[neighbor.x][neighbor.y][neighbor.z])
    .filter(neighbor => neighbor === CellType.Water)
    .length
}

const createGrid = (points: Array<Point>) => {
  const maxX = max(points, point => point.x)!.x
  const maxY = max(points, point => point.y)!.y
  const maxZ = max(points, point => point.z)!.z

  // +2 instead +1 for flood fill to work correctly around the edges
  const grid: Grid = Array.from({ length: maxX + 2 }, (): Array<Array<CellType>> => {
    return Array.from({ length: maxY + 2 }, (): Array<CellType> => {
      return Array.from({ length: maxZ + 2 }, (): CellType => CellType.Nothing)
    })
  })

  points.forEach(point => {
    grid[point.x][point.y][point.z] = CellType.Lava
  })

  return grid
}

const floodFill = (grid: Grid): void => {
  const queue: Array<Point> = [{ x: 0, y: 0, z: 0 }]

  grid[0][0][0] = CellType.Water

  while (queue.length > 0) {
    const { x, y, z } = queue.shift()!

    directions.forEach(direction => {
      if (grid[x + direction.x]?.[y + direction.y]?.[z + direction.z] === undefined) {
        return
      }

      if (grid[x + direction.x][y + direction.y][z + direction.z] === CellType.Nothing) {
        grid[x + direction.x][y + direction.y][z + direction.z] = CellType.Water

        queue.push({ x: x + direction.x, y: y + direction.y, z: z + direction.z })
      }
    })
  }
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

  floodFill(grid)

  return points.reduce<number>((acc, point) => {
    return acc + countWaterNeighbors(point, grid)
  }, 0)
}

solutionExample(calculateSurfaceArea('example.txt'))
solutionPart1(calculateSurfaceArea('input.txt'))

solutionExample(calculateOutsideSurfaceArea('example.txt'))
solutionPart2(calculateOutsideSurfaceArea('input.txt'))
