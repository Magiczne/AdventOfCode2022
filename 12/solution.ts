import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

enum PointType {
  Start = 'S',
  LowestPoint = 'a',
  Finish = 'E'
}

type Position = { x: number, y: number }
type Point = { height: number, finish?: true }
type Graph = Array<Array<Point>>

const readGraph = (file: string): [Position, Array<Position>, Position, Graph] => {
  const grid = readFileSync(resolve(__dirname, file))
    .toString()
    .trim()
    .split('\n')
    .map(line => line.split(''))

  const startX = grid.findIndex(line => line.includes(PointType.Start))
  const startY = grid[startX].findIndex(label => label === PointType.Start)
  const finishX = grid.findIndex(line => line.includes(PointType.Finish))
  const finishY = grid[finishX].findIndex(label => label === PointType.Finish)

  const start: Position = { x: startX, y: startY }
  const finish: Position = { x: finishX, y: finishY }
  const startingPositions: Array<Position> = []

  grid.forEach((row, x) => {
    row.forEach((point, y) => {
      if (point === PointType.Start || point === PointType.LowestPoint) {
        startingPositions.push({ x, y })
      }
    })
  })

  const graph: Graph = grid.map(row => {
    return row.map(point => {
      switch (point) {
        case PointType.Start:
          return {
            height: 'a'.charCodeAt(0)
          }

        case PointType.Finish:
          return {
            height: 'z'.charCodeAt(0),
            finish: true
          }

        default:
          return {
            height: point.charCodeAt(0)
          }
      }
    })
  })

  return [start, startingPositions, finish, graph]
}

const getNeighbours = (graph: Graph, { x, y }: Position): Array<Position> => {
  const neighbours = [
    x > 0 ? { x: x - 1, y } : null,
    y > 0 ? { x, y: y - 1 } : null,
    x < graph.length - 1 ? { x: x + 1, y } : null,
    y < graph[0].length - 1 ? { x, y: y + 1 } : null
  ]

  return neighbours.filter(neighbour => neighbour !== null) as Array<Position>
}

const dijkstra = (graph: Graph, start: Position, finish: Array<Position>, reverseDirection = false): number => {
  const visited: Array<string> = []
  const queue: Array<Position> = [start]
  const cost: Record<string, number> = {
    [`${start.x}_${start.y}`]: 0
  }

  let currentPosition: Position | undefined

  while(currentPosition = queue.shift()) {
    if (visited.includes(`${currentPosition.x}_${currentPosition.y}`)) {
      continue;
    }

    const currentHeight = graph[currentPosition.x][currentPosition.y].height
    const reachableNeighbours = getNeighbours(graph, currentPosition)
      .filter(neighbour => !visited.includes(`${neighbour.x}_${neighbour.y}`))
      .filter(neighbour => {
        if (reverseDirection) {
          return graph[neighbour.x][neighbour.y].height + 1 >= currentHeight
        } else {
          return graph[neighbour.x][neighbour.y].height <= currentHeight + 1
        }
      })

    queue.push(...reachableNeighbours)

    const costToCurrent = cost[`${currentPosition.x}_${currentPosition.y}`]

    reachableNeighbours.forEach(neighbour => {
      const newConstToNeighbour = costToCurrent + 1
      const costToNeighbour = cost[`${neighbour.x}_${neighbour.y}`] ?? newConstToNeighbour

      if (newConstToNeighbour <= costToNeighbour) {
        cost[`${neighbour.x}_${neighbour.y}`] = newConstToNeighbour
      }
    })

    visited.push(`${currentPosition.x}_${currentPosition.y}`)
  }

  const costs = finish
    .map(finishPosition => cost[`${finishPosition.x}_${finishPosition.y}`])
    .filter(cost => cost !== undefined)

  return Math.min(...costs)
}

const part1 = (file: string): number => {
  const [start, , finish, graph] = readGraph(file)

  return dijkstra(graph, start, [finish])
}

const part2 = (file: string): number => {
  const [, startingPositions, finish, graph] = readGraph(file)

  return dijkstra(graph, finish, startingPositions, true)
}

solutionExample(part1('example.txt'))
solutionPart1(part1('input.txt'))

solutionExample(part2('example.txt'))
solutionPart2(part2('input.txt'))
