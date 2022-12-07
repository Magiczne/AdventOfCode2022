import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

const goUpCommand = '$ cd ..'
const numericStrings =['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const totalDiskSpace = 70_000_000
const requiredFreeSpace = 30_000_000

const startsWithNumber = (data: string): boolean => {
  const char = data.at(0) ?? ''

  return numericStrings.includes(char)
}

const getDirectorySizes = (file: string): Map<string, number> => {
  const pathStack: Array<string> = []
  const directorySizes = new Map<string, number>()

  const updateSizeForDirectory = (directory: string, size: number): void => {
    if (!directorySizes.has(directory)) {
      directorySizes.set(directory, size)
    } else {
      // @ts-expect-error I'm checking that above.
      directorySizes.set(directory, directorySizes.get(directory) + size)
    }
  }

  readFileSync(resolve(__dirname, file))
    .toString()
    .trim()
    .split('\n')
    .forEach(command => {
      if (command === goUpCommand) {
        pathStack.pop()
      } else if (command.startsWith('$ cd')) {
        const [, , directoryName] = command.split(' ')
        const path = pathStack.join('') + directoryName

        pathStack.push(path)
      } else if (startsWithNumber(command)) {
        const fileSize = parseInt(command.split(' ')[0] ?? '0')

        pathStack.forEach(directory => {
          updateSizeForDirectory(directory, fileSize)
        })
      }
    })

  return directorySizes
}

const part1 = (file: string): number => {
  return [...getDirectorySizes(file).values()]
    .filter(value => value < 100_000)
    .reduce<number>((acc, value) => acc + value, 0)
}

const part2 = (file: string): number => {
  const directorySizes = getDirectorySizes(file)
  const unusedSpace = totalDiskSpace - (directorySizes.get('/') ?? 0)
  const values = [...directorySizes.values()]

  return Math.min(...values.filter(value => value + unusedSpace >= requiredFreeSpace))
}

solutionExample(part1('example.txt'))
solutionPart1(part1('input.txt'))

solutionExample(part2('example.txt'))
solutionPart2(part2('input.txt'))
