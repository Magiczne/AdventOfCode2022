import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import {
  CircularLinkedList,
  LinkedListNode,
  solutionExample,
  solutionPart1, solutionPart2
} from '../util'

const part2DecryptionKey = 811589153

const readNodes = (file: string, decryptionKey: number): Array<LinkedListNode<number>> => {
  return readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .map(item => new LinkedListNode(parseInt(item, 10) * decryptionKey))
}

const sumCoordinates = (file: string, decryptionKey = 1, rounds = 1): number => {
  const nodes = readNodes(file, decryptionKey)
  const linkedList = new CircularLinkedList(nodes)

  for (let round = 0; round < rounds; round++) {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const direction = Math.sign(node.value)
      const distance = Math.abs(node.value) % (nodes.length - 1)

      if (direction < 0) {
        linkedList.moveNodeLeft(node, distance)
      } else {
        linkedList.moveNodeRight(node, distance)
      }
    }
  }

  const values = linkedList.firstCycleValues
  const zeroIndex = values.indexOf(0)

  const nth1000 = values[(1000 + zeroIndex) % values.length]
  const nth2000 = values[(2000 + zeroIndex) % values.length]
  const nth3000 = values[(3000 + zeroIndex) % values.length]

  return nth1000 + nth2000 + nth3000
}

solutionExample(sumCoordinates('example.txt'))
solutionPart1(sumCoordinates('input.txt'))

solutionExample(sumCoordinates('example.txt', part2DecryptionKey, 10))
solutionPart2(sumCoordinates('input.txt', part2DecryptionKey, 10))
