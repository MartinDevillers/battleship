import React from "react"
import "./Board.css"
import Cell from "./Cell"
import { dimension } from "../services/coordinateUtils"

// @todo find an elegant way to make this responsive
const cellSize = 50
const width = 550
const height = 550

// Format X-axis using an alphabetical dimension
const xAxisCells = "ABCDEFGHIJ".split("").map((v, i) => (
  <Cell x={i + 1} y={0} key={v}>
    {v}
  </Cell>
))

// Format Y-axis using a numerical dimension
const yAxisCells = dimension.map((y) => (
  <Cell x={0} y={y} key={y}>
    {y}
  </Cell>
))

// Component for rendering a board with axes. Children should contain the rest of the elements on the board.
const Board: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <div className="board" style={{ width, height, backgroundSize: `${cellSize}px ${cellSize}px` }}>
    {xAxisCells}
    {yAxisCells}
    {children}
  </div>
)

export default Board
