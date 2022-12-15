import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { range, xprod } from 'ramda'
import { solutionExample, solutionPart1, solutionPart2, windows } from '../util'

type Point = { x: number, y: number }
type Cell = '.' | '#' | 'o'
type Map = Array<Array<Cell>>

const printMap = (map: Map, minX: number, minY: number, maxX: number, maxY: number): void => {
  for (let y = minY; y <= maxY; y++) {
    let row = ''

    for (let x = minX; x <= maxX; x++) {
      row += map[x][y] ?? '-'
    }

    console.log(row)
  }
}

const getWallPositions = ([start, end]: [Point, Point]): Array<Point> => {
  const rangeX = range(Math.min(start.x, end.x), Math.max(start.x, end.x) + 1)
  const rangeY = range(Math.min(start.y, end.y), Math.max(start.y, end.y) + 1)

  return xprod(rangeX, rangeY).map(point => {
    return {
      x: point[0],
      y: point[1]
    }
  })
}

const readMap = (file: string): [Map, number] => {
  const rocks: Array<Array<Point>> = readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .map(line => {
      return line
        .split(' -> ')
        .map((point): Point => {
          const parsedPoint = point.split(',')

          return {
            x: parseInt(parsedPoint[0]),
            y: parseInt(parsedPoint[1])
          }
        })
    })

  const maxY = Math.max(
    ...rocks
      .map(line => Math.max(...line.map(point => point.y)))
      .flat()
  )

  const map: Map = Array.from({ length: 1000 }, () => {
    return Array.from({ length: maxY + 1 }, () => '.')
  })


  for (const rockLine of rocks) {
    for (const window of windows(rockLine, 2)) {
      for (const point of getWallPositions(window as [Point, Point])) {
        map[point.x][point.y] = '#'
      }
    }
  }

  return [map, maxY]
}

const simulateAbyssFactorSandUnit = (map: Map, maxY: number): boolean => {
  const unitPosition: Point = { x: 500, y: 0 }

  while (true) {
    // Fallen into abyss
    if (unitPosition.y >= maxY) {
      return true
    }

    if (map[unitPosition.x][unitPosition.y + 1] === '.') {
      unitPosition.y++

      continue
    }

    if (map[unitPosition.x - 1][unitPosition.y + 1] === '.') {
      unitPosition.x--
      unitPosition.y++

      continue
    }

    if (map[unitPosition.x + 1][unitPosition.y + 1] === '.') {
      unitPosition.x++
      unitPosition.y++

      continue
    }

    map[unitPosition.x][unitPosition.y] = 'o'

    return false
  }
}

const getAbyssFactor = (file: string): number => {
  const [map, maxY] = readMap(file)
  let sandUnitsCounter = 0

  while (true) {
    let fallenIntoAbyss = simulateAbyssFactorSandUnit(map, maxY)

    if (fallenIntoAbyss) {
      break
    }

    sandUnitsCounter++
  }

  return sandUnitsCounter
}

const simulateRestFactorSandUnit = (map: Map, maxY: number): boolean => {
  const unitPosition: Point = { x: 500, y: 0 }

  while (true) {
    if (map[500][0] === 'o') {
      return true
    }

    if (map[unitPosition.x][unitPosition.y + 1] === '.') {
      unitPosition.y++

      continue
    }

    if (map[unitPosition.x - 1][unitPosition.y + 1] === '.') {
      unitPosition.x--
      unitPosition.y++

      continue
    }

    if (map[unitPosition.x + 1][unitPosition.y + 1] === '.') {
      unitPosition.x++
      unitPosition.y++

      continue
    }

    map[unitPosition.x][unitPosition.y] = 'o'

    return false
  }
}

const getRestFactor = (file: string): number => {
  const [map, maxY] = readMap(file)

  // The floor
  for (let x = 0; x < 1000; x++) {
    map[x][maxY + 1] = '.'
    map[x][maxY + 2] = '#'
  }

  let sandUnitsCounter = 0

  while (true) {
    // printMap(map, 480, 0, 515, maxY + 3)

    let sourceBlocked = simulateRestFactorSandUnit(map, maxY)

    if (sourceBlocked) {
      break
    }

    sandUnitsCounter++
  }

  return sandUnitsCounter
}

solutionExample(getAbyssFactor('example.txt'))
solutionPart1(getAbyssFactor('input.txt'))

solutionExample(getRestFactor('example.txt'))
solutionPart2(getRestFactor('input.txt'))
