import {level} from "chalk";

class DirectedGraph {
  vertices: Array<number> = []
  labels = new Map<number, string>()
  adjacencyList = new Map<number, Array<number>>()
  edges = 0

  addVertex (v: number, label?: string): void {
    this.vertices.push(v)
    this.labels.set(v, label ?? v.toString())
    this.adjacencyList.set(v, [])
  }

  addEdge (v: number, w: number): void {
    this.adjacencyList.get(v)!.push(w)
    this.edges++
  }

  bfs (root: number, goal: number): number {
    console.log('Running BFS from', root, 'to', goal)

    const queue = []
    const discovered = new Map<number, boolean>()
    const edges = new Map<number, number>()

    queue.push(root)
    discovered.set(root, true)
    edges.set(root, 0)

    while (queue.length > 0) {
      let vertex = queue.shift()!

      if (vertex === goal) {
        return edges.get(goal)!
      }

      for (let i = 0; i < this.adjacencyList.get(vertex)!.length; i++) {
        const adjacentVertex: number = this.adjacencyList.get(vertex)![i]

        if (discovered.get(adjacentVertex) !== true) {
          discovered.set(adjacentVertex, true)
          queue.push(adjacentVertex)
          edges.set(adjacentVertex, edges.get(vertex)! + 1)
        }
      }
    }

    console.log(edges.get(root), edges.get(goal))
    return -1
  }

  bfsByLabel (root: string, goal: string): number {
    const rootId = this.getIdByLabel(root)
    const goalId = this.getIdByLabel(goal)

    if (rootId === undefined || goalId === undefined) {
      throw new Error('Fail')
    }

    return this.bfs(rootId, goalId)
  }

  getIdByLabel (label: string): number | undefined {
    return [...this.labels.entries()].find(entry => {
      return entry[1] === label
    })?.[0]
  }
}

export {
  DirectedGraph
}

