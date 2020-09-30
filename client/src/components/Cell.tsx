import React from "react"

// @todo find an elegant way to make this responsive
const cellSize = 50

type CellProps = {
  x: number
  y: number
  onClick?: (x: number, y: number) => void
}

// Component for a single cell on the board. The child determines the look and feel of the cell.
const Cell: React.FC<React.PropsWithChildren<CellProps>> = ({ x, y, onClick, children }) => {
  return (
    // eslint-disable-next-line
    <div
      className="cell"
      style={{
        left: `${cellSize * x + 1}px`,
        top: `${cellSize * y + 1}px`,
        width: `${cellSize - 1}px`,
        height: `${cellSize - 1}px`,
      }}
      onClick={(): void => onClick && onClick(x, y)}
    >
      {children}
    </div>
  )
}

export default Cell
