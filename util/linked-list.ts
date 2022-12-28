class LinkedListNode<T> {
  public prev: LinkedListNode<T> | null = null
  public next: LinkedListNode<T> | null = null

  constructor(
    public readonly value: T
  ) {
  }
}

class LinkedList<T> {
  head: LinkedListNode<T>

  constructor (nodes: Array<LinkedListNode<T>>) {
    this.head = nodes[0]

    nodes.forEach((node, index) => {
      node.prev = nodes[index - 1] ?? null
      node.next = nodes[index + 1] ?? null
    })
  }
}

class CircularLinkedList<T> extends LinkedList<T> {
  private length: number

  constructor(nodes: Array<LinkedListNode<T>>) {
    super(nodes)

    nodes[0].prev = nodes[nodes.length - 1]
    nodes[nodes.length - 1].next = nodes[0]

    this.length = nodes.length
  }

  moveNodeLeft(node: LinkedListNode<T>, distance: number): void {
    if (distance === 0) {
      return
    }

    if (node === this.head) {
      this.head = node.prev!
    }

    for (let i = 0; i < distance; i++) {
      const oldNext = node.next!
      const newNext = node.prev!
      const newPrev = node.prev!.prev!

      oldNext.prev = newNext

      newNext.prev = node
      newNext.next = oldNext

      // nextPrev.prev without changes
      newPrev.next = node

      node.prev = newPrev
      node.next = newNext
    }
  }

  moveNodeRight(node: LinkedListNode<T>, distance: number): void {
    if (distance === 0) {
      return
    }

    if (node === this.head) {
      this.head = node.next!
    }

    for (let i = 0; i < distance; i++) {
      const oldPrev = node.prev!
      const newPrev = node.next!
      const newNext = node.next!.next!

      oldPrev.next = newPrev

      newPrev.prev = oldPrev
      newPrev.next = node

      newNext.prev = node
      // newNext.next without changes

      node.prev = newPrev
      node.next = newNext
    }
  }

  get firstCycleValues(): Array<T> {
    let currentNode: LinkedListNode<T> = this.head
    const values: Array<T> = []

    do {
      values.push(currentNode.value)

      // It's circular, it will always exist
      currentNode = currentNode.next!
    } while (currentNode !== this.head)

    return values
  }

  print(glue =  ' -> '): void {
    console.log(this.firstCycleValues.join(glue))
  }

  printVerbose(): void {
    let currentNode: LinkedListNode<T> = this.head

    do {
      console.log(currentNode.prev?.value, '\t->', currentNode.value, '\t->', currentNode.next?.value)

      // It's circular, it will always exist
      currentNode = currentNode.next!
    } while (currentNode !== this.head)
  }
}

export {
  LinkedList,
  LinkedListNode,
  CircularLinkedList
}
