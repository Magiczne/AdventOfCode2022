import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { last } from "radash";
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

interface Monkey {
  items: Array<number>
  operation: (level: number) => number
  divisionTest: (level: number) => boolean
  successTarget: number
  failureTarget: number
  inspectionCount: number
}

const parseOperation = (operationLine: string): (level: number) => number => {
  const [, operator, op2] = operationLine
    .split(' = ')[1]
    .split(' ')

  return (level: number): number => {
    const operand2 = op2 === 'old' ? level : parseInt(op2, 10)

    if (operator === '+') {
      return level + operand2
    } else if (operator === '*') {
      return level * operand2
    } else {
      throw new Error(`Unsupported operator ${operator}`)
    }
  }
}

const loadMonkeys = (file: string): ReadonlyArray<Monkey> => {
  return readFileSync(resolve(__dirname, file))
    .toString()
    .trim()
    .split('\n\n')
    .map(monkeyData => monkeyData.split('\n'))
    .map((monkeyData): Monkey => {
      const startingItems = monkeyData[1].split(': ')[1].split(', ')
      const divisor = parseInt(last(monkeyData[3].split(' ')) ?? '', 10)
      const successTarget = parseInt(last(monkeyData[4].split(' ')) ?? '', 10)
      const failureTarget = parseInt(last(monkeyData[5].split(' ')) ?? '', 10)

      return {
        items: startingItems.map(item => parseInt(item, 10)),
        operation: parseOperation(monkeyData[2]),
        divisionTest: value => value % divisor === 0,
        successTarget,
        failureTarget,
        inspectionCount: 0
      }
    })
}

const processRounds = (file: string, count: number): ReadonlyArray<Monkey> => {
  const monkeys = loadMonkeys(file)

  for (let i = 0; i < count; i++) {
    monkeys.forEach(monkey => {
      monkey.items.forEach(item => {
        monkey.inspectionCount++

        const newWorryLevel = Math.floor( monkey.operation(item) / 3)

        if (monkey.divisionTest(newWorryLevel)) {
          monkeys[monkey.successTarget].items.push(newWorryLevel)
        } else {
          monkeys[monkey.failureTarget].items.push(newWorryLevel)
        }
      })

      monkey.items = []
    })
  }

  return monkeys
}

const calculateMonkeyBusiness = (file: string, count: number) => {
  const inspectionCounts = processRounds(file, count)
    .map(monkey => monkey.inspectionCount)
    .sort((lhs, rhs) => rhs - lhs)

  return inspectionCounts[0] * inspectionCounts[1]
}

solutionExample(calculateMonkeyBusiness('example.txt', 20))
solutionPart1(calculateMonkeyBusiness('input.txt', 20))
