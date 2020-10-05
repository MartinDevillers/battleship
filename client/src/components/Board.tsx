import React from "react"
import "./Board.css"
import Cell from "./Cell"
import { dimension } from "../services/coordinateUtils"

// Format X-axis using an alphabetical dimension
const xAxisCells = "ABCDEFGHIJ".split("").map((v, i) => (
  <Cell x={i + 1} y={0} key={v}>
    <span>{v}</span>
  </Cell>
))

// Format Y-axis using a numerical dimension
const yAxisCells = dimension.map((y) => (
  <Cell x={0} y={y} key={y}>
    <span>{y}</span>
  </Cell>
))

// Component for rendering a board with axes. Children should contain the rest of the elements on the board.
const Board: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <div className="board">
    {xAxisCells}
    {yAxisCells}
    {children}
  </div>
)

export default Board
