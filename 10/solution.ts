import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'
import {draw} from "radash";

type InstructionType = 'addx' | 'noop'
type CPU = { programCounter: number, registerX: number }

interface Instruction {
  type: InstructionType
  cycleCount: number
}

interface AddxInstruction extends Instruction {
  type: 'addx'
  value: number
}

interface NoopInstruction extends Instruction {
  type: 'noop'
}

type AnyInstruction = AddxInstruction | NoopInstruction

const readInstructions = (file: string): ReadonlyArray<AnyInstruction> => {
  return readFileSync(resolve(__dirname, file))
    .toString()
    .trim()
    .split('\n')
    .map((line): AnyInstruction => {
      const [type, value] = line.split(' ') as [InstructionType, string | undefined]

      if (type === 'noop') {
        return { type: 'noop', cycleCount: 1 }
      }

      return {
        type: 'addx',
        cycleCount: 2,
        value: parseInt(value ?? '', 10)
      }
    })
}

function* executeInstruction(instruction: AnyInstruction, cpu: CPU): Generator<CPU> {
  let cpuState = { ...cpu }

  for (let i = 0; i < instruction.cycleCount; i++) {
    if (instruction.type === 'noop' || i !== instruction.cycleCount - 1) {
      cpuState = {
        programCounter: cpuState.programCounter + 1,
        registerX: cpuState.registerX
      }
    } else if (instruction.type === 'addx') {
      cpuState = {
        programCounter: cpuState.programCounter + 1,
        registerX: cpuState.registerX + instruction.value
      }
    } else {
      throw new Error('Unsupported instruction')
    }

    yield cpuState
  }
}

const sumSignalStrengths = (file: string): number => {
  const breakpoints: ReadonlyArray<number> = [20, 60, 100, 140, 180, 220]
  let breakpointsRegisterSum = 0

  const instructions = readInstructions(file)
  let cpu: CPU = { programCounter: 1, registerX: 1 }

  instructions.forEach(instruction => {
    for (const newCpuState of executeInstruction(instruction, cpu)) {
      cpu = newCpuState

      if (breakpoints.includes(cpu.programCounter)) {
        breakpointsRegisterSum += cpu.registerX * cpu.programCounter
      }
    }
  })

  return breakpointsRegisterSum
}

const drawScreen = (file: string): string => {
  const breakpoints: ReadonlyArray<number> = [40, 80, 120, 160, 200, 240]
  const instructions = readInstructions(file)

  let cpu: CPU = { programCounter: 1, registerX: 1 }
  let screen = ''

  instructions.forEach(instruction => {
    for (const newCpuState of executeInstruction(instruction, cpu)) {
      const screenPosition = (cpu.programCounter - 1) % 40

      if (cpu.registerX >= screenPosition - 1 && cpu.registerX <= screenPosition + 1) {
        screen += '#'
      } else {
        screen += '.'
      }

      if (breakpoints.includes(cpu.programCounter)) {
        screen += '\n'
      }

      cpu = newCpuState
    }
  })

  return screen.trim()
}

solutionExample(sumSignalStrengths('example.txt'))
solutionPart1(sumSignalStrengths('input.txt'))

solutionExample(drawScreen('example.txt'))
solutionPart2(drawScreen('input.txt'))
