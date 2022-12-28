import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { CircularLinkedList, LinkedListNode, solutionExample} from '../util'

const decryptionKey = 811589153

const readNodes = (file: string): Array<LinkedListNode<number>> => {
  return readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .map(item => new LinkedListNode(parseInt(item, 10)))
}

function printVerbose<T>(node: LinkedListNode<T>): void {
  let currentNode: LinkedListNode<T> = node

  do {
    console.log(currentNode.prev?.value, '\t->', currentNode.value, '\t->', currentNode.next?.value)

    // It's circular, it will always exist
    currentNode = currentNode.next!
  } while (currentNode !== node)
}

const sumCoordinates = (file: string): number => {
  const nodes = readNodes(file)
  const linkedList = new CircularLinkedList(nodes)

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const direction = Math.sign(node.value)
    const distance = Math.abs(node.value)

    if (direction < 0) {
      linkedList.moveNodeLeft(node, distance)
    } else {
      linkedList.moveNodeRight(node, distance)
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
solutionExample(sumCoordinates('input.txt'))
