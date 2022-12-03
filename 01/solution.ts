import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

const calculateSums = (file: string): Array<number> => {
  return readFileSync(resolve(__dirname, file))
    .toString()
    .trim()
    .split('\n\n')
    .map(item => {
      return item
        .split('\n')
        .map(item => parseInt(item, 10))
        .reduce<number>((acc, item) => acc + item, 0)
    })
}

const sumOfThreeLargest = (file: string): number => {
  return calculateSums(file)
    .sort((lhs, rhs) => lhs - rhs)
    .slice(-3)
    .reduce<number>((acc, item) => acc + item, 0)
}

solutionExample(Math.max(...calculateSums('example.txt')))
solutionPart1(Math.max(...calculateSums('input.txt')))
solutionPart2(sumOfThreeLargest('input.txt'))
