import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

type Packet = Array<number | Packet>
type PacketPair = [Packet, Packet]

const dividerPackets: PacketPair = [
  [[2]],
  [[6]]
]

const readPackets = (file: string): Array<PacketPair> => {
  return readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('\n\n')
    .map(packets => {
      return packets
        .split('\n')
        .map(packet => JSON.parse(packet) as Packet) as PacketPair
    })
}

const inputsInRightOrder = (
  lhs: number | Packet | undefined,
  rhs: number | Packet | undefined
): boolean | null => {
  if (lhs === undefined && rhs === undefined || lhs === undefined) {
    return true
  }

  if (rhs === undefined) {
    return false
  }

  const lhsIsArray = Array.isArray(lhs)
  const rhsIsArray = Array.isArray(rhs)

  if (lhsIsArray && rhsIsArray) {
    for (let i = 0; i < Math.max(lhs.length, rhs.length); i++) {
      const value = inputsInRightOrder(lhs[i], rhs[i])

      if (value !== null) {
        return value
      }
    }
  }

  if (!lhsIsArray && rhsIsArray) {
    return inputsInRightOrder([lhs], rhs)
  }

  if (lhsIsArray && !rhsIsArray) {
    return inputsInRightOrder(lhs, [rhs])
  }

  if (!lhsIsArray && !rhsIsArray) {
    if (lhs < rhs) {
      return true
    }

    if (lhs > rhs) {
      return false
    }
  }

  return null
}

const countPairsInRightOrder = (file: string): number => {
  return readPackets(file)
    .map(pair => inputsInRightOrder(pair[0], pair[1]))
    .reduce<number>((acc, isValid, index) => {
      if (isValid === null) {
        throw new Error('Nobody expects spanish inquisition')
      }

      if (isValid) {
        return acc + index + 1
      }

      return acc
    }, 0)
}

const getDecoderKey = (file: string): number => {
  const packets = readPackets(file)
    .flat()
    .concat(dividerPackets)
    .sort((lhs, rhs) => {
      const order = inputsInRightOrder(lhs, rhs)

      if (order === true) {
        return -1
      } else {
        return 1
      }
    })
    .map(packet => JSON.stringify(packet))

  return dividerPackets
    .map(packet => JSON.stringify(packet))
    .map(packet => packets.findIndex(item => item === packet))
    .reduce<number>((acc, index) => acc * (index + 1), 1)
}

solutionExample(countPairsInRightOrder('example.txt'))
solutionPart1(countPairsInRightOrder('input.txt'))

solutionExample(getDecoderKey('example.txt'))
solutionPart2(getDecoderKey('input.txt'))
