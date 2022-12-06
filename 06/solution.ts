import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

const findMarkerPosition = (packet: string, markerLength: number): number => {
  for (let i = 0; i < packet.length; i++) {
    const slice = packet.slice(i, i + markerLength)

    if ([...new Set(slice.split(''))].length === markerLength) {
      return i + markerLength
    }
  }

  throw new Error('No marker found')
}

const examples = readFileSync(resolve(__dirname, 'examples.txt'))
  .toString()
  .trim()
  .split('\n')

const input = readFileSync(resolve(__dirname, 'input.txt'))
  .toString()
  .trim()
  .split('\n')

examples.forEach(packet => solutionExample(findMarkerPosition(packet, 4)))
input.forEach(packet => solutionPart1(findMarkerPosition(packet, 4)))

examples.forEach(packet => solutionExample(findMarkerPosition(packet, 14)))
input.forEach(packet => solutionPart2(findMarkerPosition(packet, 14)))

