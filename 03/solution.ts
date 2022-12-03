import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { cluster, unique } from 'radash'
import { intersection, isUpperCase, solutionExample, solutionPart1, solutionPart2 } from '../util'

type Rucksack = [Array<string>, Array<string>]

const getRucksacks = (file: string): Array<string> => {
  return readFileSync(resolve(__dirname, file))
    .toString()
    .trim()
    .split('\n')
}

const calculatePriorities = (itemTypes: Array<Array<string>>): number => {
  return itemTypes
    .map((intersection, index) => {
      const noDuplicates = unique(intersection)

      if (noDuplicates.length > 1) {
        throw new Error(`More than one duplicate in rucksack ${index}`)
      }

      return noDuplicates
    })
    .flat()
    .map(letter => {
      if (isUpperCase(letter)) {
        return letter.charCodeAt(0) - 38
      }

      return letter.charCodeAt(0) - 96
    })
    .reduce<number>((acc, priority) => acc + priority, 0)
}

const intersectionPriority = (file: string): number => {
  const itemTypes = getRucksacks(file)
    .map(line => {
      const middle = line.length / 2

      return [
        line.slice(0, middle).split(''),
        line.slice(middle).split('')
      ] as Rucksack
    })
    .map(rucksack => intersection(rucksack[0], rucksack[1]))

  return calculatePriorities(itemTypes)
}

const groupPriority = (file: string) => {
  const itemTypes = cluster(getRucksacks(file).map(rucksack => rucksack.split('')), 3)
    .map(group => {
      return [
        intersection(group[0], group[1]),
        group[2]
      ]
    })
    .map(group => intersection(group[0], group[1]))

  return calculatePriorities(itemTypes)
}

solutionExample(intersectionPriority('example.txt'))
solutionPart1(intersectionPriority('input.txt'))

solutionExample(groupPriority('example.txt'))
solutionPart2(groupPriority('input.txt'))
