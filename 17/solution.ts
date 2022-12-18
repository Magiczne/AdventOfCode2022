import { resolve } from 'node:path'
import { readFileSync } from 'node:fs'
import { solutionExample, solutionPart1, solutionPart2 } from '../util'

const enum Move {
  Left= '<',
  Right = '>'
}

interface Point {
  x: number
  y: number
}

type BoardItem = '.' | '#'
type Piece = ReadonlyArray<Point>
type Board = Array<Array<BoardItem>>

const boardLength = 7
const pieces: Array<Piece> = [
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 }
  ],
  [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 1 }
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 2, y: 1 },
    { x: 2, y: 2 }
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 }
  ],
  [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 }
  ]
]

const readMoves = (file: string): Array<Move> => {
  return readFileSync(resolve(__dirname, file), 'utf-8')
    .trim()
    .split('') as Array<Move>
}

const printBoard = (board: Board, piece?: Piece): void => {
  for (let i = board.length - 1; i >= 0; i--) {
    if (piece) {
      let ret = '|'

      board[i].forEach((item, index) => {
        if (piece.some(piecePart => piecePart.x === index && piecePart.y === i)) {
          ret += '@'
        } else {
          ret += item
        }
      })

      console.log(`${ret}|`)
    } else {
      console.log(`|${board[i].join('')}|`)
    }
  }

  console.log(`+${'-'.repeat(boardLength)}+\n`)
}

const createEmptyBoardRows = (length: number): Board => {
  return Array.from({ length }, (): Array<BoardItem> => {
    return '.'.repeat(boardLength).split('') as Array<BoardItem>
  })
}

const translatePiece = (piece: Piece, x = 0, y = 0): Piece => {
  return piece.map(point => {
    return {
      x: point.x + x,
      y: point.y + y
    }
  })
}

const getPieceAtStartingPosition = (move: number, maxHeight: number): Piece => {
  return translatePiece(
    pieces[move % 5],

    // Left edge is two units away from the left wall
    2,

    // bottom edge is three units above the highest rock in the room
    maxHeight + 3
  )
}

const pieceOutsideOfBounds = (piece: Piece): boolean => {
  return piece.some(position => {
    return position.x < 0 || position.x > boardLength - 1
  })
}

const checkCollision = (piece: Piece, board: Board): boolean => {
  if (piece.some(point => point.y === -1)) {
    return true
  }

  for (const point of piece) {
    try {
      if (board[point.y][point.x] === '#') {
        return true
      }
    } catch (e) {
      console.log(
        point,
        board.length,
        // board[point.y].length
      )

      process.exit(1)
    }
  }

  return false
}

const getPieceFinalPosition = (piece: Piece, board: Board, moves: Array<Move>, debug = false) => {
  let currentPiecePosition = piece

  while (true) {
    // 1. Move according to jets and check collision
    const move = moves.shift()
    moves.push(move!)

    let nextPosition = currentPiecePosition

    if (move === Move.Left) {
      nextPosition = translatePiece(currentPiecePosition, -1)
    } else if (move === Move.Right) {
      nextPosition = translatePiece(currentPiecePosition, 1)
    }

    if (!pieceOutsideOfBounds(nextPosition) && !checkCollision(nextPosition, board)) {
      currentPiecePosition = nextPosition
    }

    // 2. move down and check collision
    const pieceAfterMoveDown = translatePiece(currentPiecePosition, 0, -1)

    if (debug) {
      printBoard(board, currentPiecePosition)
    }

    if (checkCollision(pieceAfterMoveDown, board)) {
      return currentPiecePosition
    }

    currentPiecePosition = pieceAfterMoveDown

    if (debug) {
      printBoard(board, currentPiecePosition)
    }
  }
}

const getTowerHeight = (file: string, rocksCount: number): number => {
  // 3 units above floor + 4 as height of highest puzzle
  const board: Board = createEmptyBoardRows(4 + 3)
  const moves = readMoves(file)
  let currentMaxHeight = 0

  for (let i = 0; i < rocksCount; i++) {
    const piece = getPieceAtStartingPosition(i, currentMaxHeight)
    const pieceFinalPosition = getPieceFinalPosition(piece, board, moves)

    currentMaxHeight = Math.max(currentMaxHeight, Math.max(...pieceFinalPosition.map(point => point.y)) + 1)

    // Expanding board as needed
    if (board.length - currentMaxHeight - 1 <= 12) {
      board.push(...createEmptyBoardRows(12))
    }

    pieceFinalPosition.forEach(point => board[point.y][point.x] = '#')

    // printBoard(board, piece)
  }

  return currentMaxHeight
}


solutionExample(getTowerHeight('example.txt', 2022))
solutionPart1(getTowerHeight('input.txt', 2022))
