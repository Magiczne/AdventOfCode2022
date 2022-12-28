import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

type Monkeys = Record<string, Monkey>
type MonkeyOperationCache = Map<string, number>
type MonkeyOperation = (monkeys: Monkeys, cache: MonkeyOperationCache) => number

interface Monkey {
  id: string
  lone: boolean
  operation: MonkeyOperation
}

const readMonkeys = (file: string): Monkeys => {
  const monkeys = readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n')
    .map(line => {
      const [id, operation] = line.split(': ')

      if (!operation.includes(' ')) {
        const value = parseInt(operation, 10)

        return {
          id,
          lone: true,
          operation(): number {
            return value
          }
        }
      }

      const [monkey1, operator, monkey2] = operation.split(' ')

      return {
        id,
        lone: false,
        operation(monkeys: Monkeys, cache: MonkeyOperationCache): number {
          if (cache.has(id)) {
            return cache.get(id)!
          }

          let value: number

          switch (operator) {
            case '+':
              value = monkeys[monkey1].operation(monkeys, cache) + monkeys[monkey2].operation(monkeys, cache)
              break;

            case '-':
              value = monkeys[monkey1].operation(monkeys, cache) - monkeys[monkey2].operation(monkeys, cache)
              break;

            case '*':
              value = monkeys[monkey1].operation(monkeys, cache) * monkeys[monkey2].operation(monkeys, cache)
              break;

            case '/':
              value = monkeys[monkey1].operation(monkeys, cache) / monkeys[monkey2].operation(monkeys, cache)
              break;

            default:
              throw new Error('Not supported operation')
          }

          cache.set(id, value)

          return value
        }
      }
    })
    .map(monkey => [monkey.id, monkey])

  return Object.fromEntries(monkeys)
}

const getRootMonkeyValue = (file: string): number => {
  const monkeys = readMonkeys(file)
  const monkeyOperationCache = new Map<string, number>()

  return monkeys['root'].operation(monkeys, monkeyOperationCache)
}


solutionExample(getRootMonkeyValue('example.txt'))
solutionPart1(getRootMonkeyValue('input.txt'))
