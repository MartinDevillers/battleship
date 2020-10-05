import React from "react"

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
        transform: `translate(${x}00%,${y}00%) translate(+${x + 1}px,+${y + 1}px)`,
      }}
      onClick={(): void => onClick && onClick(x, y)}
    >
      {children}
    </div>
  )
}

export default Cell
