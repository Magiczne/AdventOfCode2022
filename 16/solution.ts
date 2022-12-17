import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

interface GraphNode {
  id: string
  rate: number
}

interface Graph {
  nodes: Map<string, GraphNode>
  adjacency: Map<string, Array<string>>
}

interface PathInfo {
  node: GraphNode
  distance: number
}

interface TimePath {
  id: string
  time: number
}

interface StartingNodes {
  me: string
  elephant: string
}

const readGraph = (file: string): [Graph, number] => {
  const regex = /[a-zA-Z]+ (?<id>[A-Z]{2})[a-zA-Z =]+(?<rate>[0-9]+);[a-z ]+(?<adjacent_valves>[A-Z, ]+)/

  const graph: Graph = {
    nodes: new Map<string, GraphNode>(),
    adjacency: new Map<string, Array<string>>()
  }

  readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .forEach(line => {
      const result = regex.exec(line)!

      const id = result.groups?.['id']!
      const rate = parseInt(result.groups?.['rate']!)
      const adjacentValves = result.groups?.['adjacent_valves'].split(', ')!

      graph.nodes.set(id, { id, rate })
      graph.adjacency.set(id, adjacentValves)
    })

  const valveRateSum = [...graph.nodes.values()].map(node => node.rate).reduce((acc, rate) => {
    return acc + rate
  }, 0)

  return [graph, valveRateSum]
}

const possiblePathsCache = new Map<string, Array<TimePath>>()

const createPossibleTimePaths = (graph: Graph, node: GraphNode,): Array<TimePath> => {
  if (possiblePathsCache.has(node.id))  {
    return possiblePathsCache.get(node.id)!
  }

  const queue: Array<PathInfo> = [{ node, distance: 0 }]
  const result = new Map<string, number>()

  while (queue.length > 0) {
    const info = queue.shift()!

    graph.adjacency.get(info.node.id)!.forEach(adjacentNodeId => {
      if (!result.has(adjacentNodeId)) {
        // 1 for moving and 1 for opening the valve
        result.set(adjacentNodeId, info.distance + 2)

        queue.push({
          node: graph.nodes.get(adjacentNodeId)!,
          distance: info.distance + 1
        })
      }
    })
  }

  const timePaths: Array<TimePath> = [...result.entries()].filter(entry => {
    return graph.nodes.get(entry[0])!.rate > 0
  }).map(entry => {
    return {
      id: entry[0],
      time: entry[1]
    }
  })

  possiblePathsCache.set(node.id, timePaths)

  return timePaths
}

const part1 = (file: string): number => {
  const [graph, valveRateSum] = readGraph(file)
  const optimisticPressure = valveRateSum / 2
  let bestPressure = 0

  const computePressure = (currentPresure: number, timeLeft: number, openValves: Set<string>, currentNode: string) => {
    let pressure = currentPresure

    createPossibleTimePaths(graph, graph.nodes.get(currentNode)!).forEach(({ id, time }) => {
      if (!openValves.has(id) && time <= timeLeft) {
        const nextNode = id
        const nextTimeLeft = timeLeft - time
        const nextCurrentPressure = currentPresure + (timeLeft - time) * graph.nodes.get(id)!.rate
        const optimisticPressureToRelease = (nextTimeLeft - time + 3) * optimisticPressure

        if (nextCurrentPressure + optimisticPressureToRelease < bestPressure) {
          return
        }

        const newOpenValves = new Set([...openValves, id])
        const nextPressure = computePressure(nextCurrentPressure, nextTimeLeft, newOpenValves, nextNode)

        pressure = Math.max(pressure, nextPressure)
      }
    })

    bestPressure = Math.max(bestPressure, currentPresure)

    return pressure
  }

  computePressure(0, 30, new Set(), 'AA')

  return bestPressure
}

const part2 = (file: string): number => {
  const [graph, valveRateSum] = readGraph(file)
  const optimisticPressure = valveRateSum / 4
  let bestPressure = 0

  const computePressure = (
    currentPresure: number,
    myTimeLeft: number,
    elephantWorkingTime: number,
    openValves: Set<string>,
    startingNodes: StartingNodes
  ) => {
    let pressure = currentPresure

    createPossibleTimePaths(graph, graph.nodes.get(startingNodes.me)!).forEach(({ id, time }) => {
      if (!openValves.has(id) && time <= myTimeLeft) {
        const elephantCanReachValve = elephantWorkingTime < time

        const nextStartingNodes: StartingNodes = elephantCanReachValve
          ? { me: startingNodes.elephant, elephant: id }
          : { me: id, elephant: startingNodes.elephant }

        const nextTimeLeft = elephantCanReachValve ? myTimeLeft - elephantWorkingTime : myTimeLeft - time
        const nextElephantWorkingTime = elephantCanReachValve ? time - elephantWorkingTime : elephantWorkingTime - time

        const nextCurrentPressure = currentPresure + (myTimeLeft - time) * graph.nodes.get(id)!.rate
        const optimisticPressureToRelease = (nextTimeLeft * 2 - time - elephantWorkingTime + 3) * optimisticPressure

        if (nextCurrentPressure + optimisticPressureToRelease < bestPressure) {
          return
        }

        const newOpenValves = new Set([...openValves, id])
        const nextPressure = computePressure(nextCurrentPressure, nextTimeLeft, nextElephantWorkingTime, newOpenValves, nextStartingNodes)

        pressure = Math.max(pressure, nextPressure)
      }
    })

    bestPressure = Math.max(bestPressure, currentPresure)

    return pressure
  }

  computePressure(0, 26, 0, new Set(), { me: 'AA', elephant: 'AA' })

  return bestPressure
}

// Only one can run at the time ??? Nvm, it's working
// solutionExample(part1('example.txt'))
solutionPart1(part1('input.txt'))

// solutionExample(part2('example.txt'))
solutionPart2(part2('input.txt'))
