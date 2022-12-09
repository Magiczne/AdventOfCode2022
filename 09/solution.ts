import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { last } from 'radash'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

// x = 0, y = 0 at bottom left
type Direction = 'U' | 'R' | 'D' | 'L'
type Instruction = { direction: Direction, distance: number }
type Position = { x: number, y: number }

const readInstructions = (file: string): ReadonlyArray<Instruction> => {
  return readFileSync(resolve(__dirname, file))
    .toString()
    .trim()
    .split('\n')
    .map((item): Instruction => {
      const [direction, distance] = item.split(' ')

      return {
        direction: direction as Direction,
        distance: parseInt(distance, 10)
      }
    })
}

const moveHead = ({ x, y }: Position, direction: Direction): Position => {
  switch (direction) {
    case "U":
      return { x, y: y + 1 }

    case "R":
      return { x: x + 1, y }

    case "D":
      return { x, y: y - 1 }

    case "L":
      return { x: x - 1, y }
  }
}

const moveTail = ({ x, y }: Position, { x: headX, y: headY }: Position): Position => {
  const dX = headX - x
  const dY = headY - y

  if (Math.abs(dX) <= 1 && Math.abs(dY) <= 1) {
    return { x, y }
  }

  return {
    x: x + Math.sign(dX),
    y: y + Math.sign(dY)
  }
}

const getUniqueTailPositions = (instructions: ReadonlyArray<Instruction>): number => {
  const uniquePositions = new Set<string>(['0,0'])
  let tailPosition: Position = { x: 0, y: 0 }
  let headPosition: Position = { x: 0, y: 0 }

  instructions.forEach(instruction => {
    for (let i = 0; i < instruction.distance; i++) {
      headPosition = moveHead(headPosition, instruction.direction)
      tailPosition = moveTail(tailPosition, headPosition)

      uniquePositions.add(`${tailPosition.x},${tailPosition.y}`)
    }
  })

  return uniquePositions.size
}

const getUniqueTailPositions2 = (instructions: ReadonlyArray<Instruction>, tailLength: number): number => {
  const uniquePositions = new Set<string>(['0,0'])
  let headPosition: Position = { x: 0, y: 0 }
  let tailsPositions: ReadonlyArray<Position> = Array.from({ length: tailLength }, () => ({ x: 0, y: 0 }))

  instructions.forEach(instruction => {
    for (let i = 0; i < instruction.distance; i++) {
      headPosition = moveHead(headPosition, instruction.direction)

      const newTailsPositions: Array<Position> = []

      for (let j = 0; j < tailLength; j++) {
        newTailsPositions[j] = moveTail(tailsPositions[j], j === 0 ? headPosition : newTailsPositions[j - 1])
      }

      tailsPositions = newTailsPositions

      const tail = last(tailsPositions)
      uniquePositions.add(`${tail?.x},${tail?.y}`)
    }
  })

  return uniquePositions.size
}

const exampleInstructions = readInstructions('example.txt')
const exampleInstructions2 = readInstructions('example2.txt')
const inputInstructions = readInstructions('input.txt')

solutionExample(getUniqueTailPositions(exampleInstructions))
solutionPart1(getUniqueTailPositions(inputInstructions))

solutionExample(getUniqueTailPositions2(exampleInstructions2, 9))
solutionPart2(getUniqueTailPositions2(inputInstructions, 9))
