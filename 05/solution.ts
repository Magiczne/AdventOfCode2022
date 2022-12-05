import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { cluster, last } from 'radash'
import { transpose } from 'ramda'
import { isUpperCaseLetter, solutionExample, solutionPart1, solutionPart2 } from '../util'

type Stack = Array<Uppercase<string>>
type Stacks = Record<number, Stack>
type Order = { from: number, to: number, count: number }

const readData = (file: string): [Stacks, ReadonlyArray<Order>] => {
  const [rawStacks, rawOrders] = readFileSync(resolve(__dirname, file))
    .toString()
    .split('\n\n')

  const parsedLines = rawStacks
    .split('\n')
    .slice(0, -1)
    .map(line => {
      return cluster([...line], 4)
        .map(cluster => {
          return cluster
            .filter(character => {
              return isUpperCaseLetter(character)
            })
            .flat()[0]
        })
    })

  const stacks = transpose(parsedLines)
    .map((stack: Array<string>): Stack => {
      return stack
        .filter(value => value !== undefined)
        .reverse() as Stack
    })
    .map((stack, index) => {
      return [index + 1, stack]
    })

  const orders = rawOrders
    .trim()
    .split('\n')
    .map(order => order.split(' '))
    .map((order): Order => {
      return {
        from: parseInt(order[3], 10),
        to: parseInt(order[5], 10),
        count: parseInt(order[1], 10)
      }
    })

  return [Object.fromEntries(stacks), orders]
}

const processOrders = (stacks: Stacks, orders: ReadonlyArray<Order>, pickUpMultiple = false): string => {
  const processedStacks = orders.reduce<Stacks>((reducedStacks, order) => {
    const fromStack = reducedStacks[order.from]
    const toStack = reducedStacks[order.to]
    const slice = fromStack.slice(fromStack.length - order.count, fromStack.length)

    return {
      ...reducedStacks,
      [order.from]: fromStack.slice(0, fromStack.length - order.count),
      [order.to]: toStack.concat(pickUpMultiple ? slice : slice.reverse())
    }
  }, stacks)

  return Object.values(processedStacks)
    .map(stack => last(stack))
    .join('')
}

const [exampleStacks, exampleOrders] = readData('example.txt')
const [stacks, orders] = readData('input.txt')

solutionExample(processOrders(exampleStacks, exampleOrders))
solutionPart1(processOrders(stacks, orders))

solutionExample(processOrders(exampleStacks, exampleOrders, true))
solutionPart1(processOrders(stacks, orders, true))
