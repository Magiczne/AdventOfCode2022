import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

type Position = { x: number, y: number }
type Dataset = {
  sensors: Array<Position>
  beacons: Array<Position>
}

const printMap = (map: Array<Position>, sensors: Array<Position>, beacons: Array<Position>, minX: number, minY: number, maxX: number, maxY: number): void => {
  for (let y = minY; y <= maxY; y++) {
    let row = ''

    for (let x = minX; x <= maxX; x++) {
      if (sensors.find(pos => pos.x === x && pos.y === y)) {
        row += 'S'
      } else if (beacons.find(pos => pos.x === x && pos.y === y)) {
        row += 'B'
      } else if (map.find(pos => pos.x === x && pos.y === y)) {
        row += '#'
      } else {
        row += '.'
      }
    }

    console.log(row)
  }
}

const manhattanDistance = (a: Position, b: Position): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

const readData = (file: string): Dataset => {
  const regex = /^[a-zA-Z =]+(?<x1>[\d\-]+), y=(?<y1>[\d\-]+):[a-zA-Z =]+(?<x2>[\d\-]+), y=(?<y2>[\d\-]+)/
  const sensors: Array<Position> = []
  const beacons: Array<Position> = []

  readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .map(line => {
      const result = regex.exec(line)!

      sensors.push({
        x: parseInt(result.groups?.['x1'] ?? '', 10),
        y: parseInt(result.groups?.['y1'] ?? '', 10)
      })

      beacons.push({
        x: parseInt(result.groups?.['x2'] ?? '', 10),
        y: parseInt(result.groups?.['y2'] ?? '', 10)
      })
    })

  return { sensors, beacons }
}

const countBeaconImpossiblePositionsInRow = (file: string, targetY: number): number => {
  const { sensors, beacons } = readData(file)
  // const unavailabilityMap: Array<Position> = []
  const unavailabilityRow = new Set<number>()

  sensors.forEach((sensor, index): void => {
    const beacon = beacons[index]!
    const distanceToBeacon = manhattanDistance(sensor, beacon)

    // unavailabilityMap.push(sensor)
    // unavailabilityMap.push(beacon)

    const startY = sensor.y - distanceToBeacon
    const endY = sensor.y + distanceToBeacon

    if (targetY < startY || targetY > endY) {
      // We do not care about not our row
      return
    }

    for (let x = sensor.x - distanceToBeacon; x <= sensor.x + distanceToBeacon; x++) {
      // for (let y = startY; y <= endY; y++) {
        if (manhattanDistance(sensor, { x, y: targetY }) <= distanceToBeacon) {
          // unavailabilityMap.push({ x, y })

          // if (y === targetY) {
            unavailabilityRow.add(x)
          // }
        }
      // }
    }

    // printMap(unavailabilityMap, sensors, beacons, -15, -15, 35, 35)
    // console.log(beacon, sensor, distanceToBeacon)
  })

  const uniqueBeacons = [...new Set(beacons.filter(beacon => beacon.y === targetY).map(beacon => beacon.x))]

  return unavailabilityRow.size - uniqueBeacons.length
}

const getPointPerimeter = ({ x, y }: Position, distance: number): Array<Position> => {
  const topRight = Array.from({ length: distance + 2 }, (_, i): Position => {
    return { x: x + i, y: y - distance + i + 1 }
  })

  const bottomRight = Array.from({ length: distance + 2 }, (_, i): Position => {
    return { x: x + i, y: y + distance - i + 1 }
  });

  const bottomLeft = Array.from({ length: distance + 2 }, (_, i): Position => {
    return { x: x - i, y: y + distance - i + 1 }
  });

  const topLeft = Array.from({ length: distance + 2 }, (_, i): Position => {
    return { x: x - i, y: y - distance + i - 1 }
  });

  return [
    ...topRight,
    ...bottomRight,
    ...bottomLeft,
    ...topLeft
  ]
}

const pointInBounds = ({ x, y }: Position, limit: number): boolean => {
  return x >= 0 && y >= 0 && x <= limit && y <= limit
}

const findTuningFrequency = (file: string, limit: number): number => {
  const { sensors, beacons } = readData(file)
  const distances = sensors.map((sensor, index): number => {
    const beacon = beacons[index]!

    return manhattanDistance(sensor, beacon)
  })

  const possiblePoints = sensors.flatMap((sensor, index): Array<Position> => {
    const distance = distances[index]
    const perimeter = getPointPerimeter(sensor, distance)

    const visibleBySensors = perimeter.map(point => {
      const inRangeOfAnySensor = sensors.some((sensor, sensorIndex): boolean => {
        return manhattanDistance(sensor, point) <= distances[sensorIndex]
      })

      if (!inRangeOfAnySensor && pointInBounds(point, limit)) {
        return point
      }

      return null
    })

    return visibleBySensors.filter(point => point !== null) as Array<Position>
  })

  const distressBeacon = possiblePoints[0]

  if (!distressBeacon) {
    throw new Error('Whoops.')
  }

  return distressBeacon.x * 4000000 + distressBeacon.y
}

solutionExample(countBeaconImpossiblePositionsInRow('example.txt', 10))
solutionPart1(countBeaconImpossiblePositionsInRow('input.txt', 2000000))

solutionExample(findTuningFrequency('example.txt', 20))
solutionPart2(findTuningFrequency('input.txt', 4000000))
