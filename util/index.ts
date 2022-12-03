import boxen, { type Options } from 'boxen'
import chalk from 'chalk'

const getBoxenConfig = (title: string): Options => {
  return {
    borderColor: 'grey',
    borderStyle: 'bold',
    padding: {
      top: 0,
      bottom: 0,
      left: 6,
      right: 6
    },
    textAlignment: 'center',
    title,
    titleAlignment: 'center',
  }
}

const solutionExample = (output: string | number): void => {
  console.log(
    boxen(
      chalk.green(output),
      getBoxenConfig('Example')
    )
  )
}

const solutionPart1 = (output: string | number): void => {
  console.log(
    boxen(
      chalk.cyan(output),
      getBoxenConfig('Part 1')
    )
  )
}

const solutionPart2 = (output: string | number): void => {
  console.log(
    boxen(
      chalk.blue(output),
      getBoxenConfig('Part 2')
    )
  )
}

export {
  solutionExample,
  solutionPart1,
  solutionPart2
}
