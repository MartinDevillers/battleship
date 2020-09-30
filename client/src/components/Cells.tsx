import React from "react"
import Cell from "./Cell"
import { Focus, Ship, ShotHit, ShotMiss, SunkShip, Targeting } from "./Icons"
import { CoordinateDto, ShipDto, ShotDto } from "../dto"
import { invert, serialize } from "../services/coordinateUtils"

// Component for a hit or missed shot
const ShotCell: React.FC<ShotDto> = (shot) => (
  <Cell x={shot.target.x} y={shot.target.y} key={serialize(shot.target)}>
    {shot.isHit ? <ShotHit /> : <ShotMiss />}
  </Cell>
)

// Component for a series of shots
export const ShotCells: React.FC<{ shots: ShotDto[] }> = ({ shots }) => <>{shots.map(ShotCell)}</>

// Component for a single part of a ship
const ShipCell: React.FC<CoordinateDto> = (shipPart) => (
  <Cell x={shipPart.x} y={shipPart.y} key={serialize(shipPart)}>
    <Ship />
  </Cell>
)

// Component for a series of ships
export const ShipCells: React.FC<{ ships: ShipDto[] }> = ({ ships }) => (
  <>{ships.flatMap((s) => s.positions).map(ShipCell)}</>
)

// Component for a single part of a sunk ship
const SunkShipCell: React.FC<CoordinateDto> = (shipPart) => (
  <Cell x={shipPart.x} y={shipPart.y} key={serialize(shipPart)}>
    <SunkShip />
  </Cell>
)

// Component for a series of sunk ships
export const SunkShipCells: React.FC<{ ships: ShipDto[] }> = ({ ships }) => (
  <>{ships.flatMap((s) => s.positions).map(SunkShipCell)}</>
)

type TargetCellsProps = {
  shots: ShotDto[]
  onTargetClicked: (x: number, y: number) => void
}

// Component for all possible targets (= full grid - previous shots)
export const TargetCells: React.FC<TargetCellsProps> = ({ shots, onTargetClicked }) => {
  const shotCoordinates = shots.map((s) => s.target)
  const targetCells = invert(shotCoordinates).map((t) => (
    <Cell x={t.x} y={t.y} key={serialize(t)} onClick={onTargetClicked}>
      <Focus />
    </Cell>
  ))
  return <>{targetCells}</>
}

// Component for a single target
export const TargetingCell: React.FC<CoordinateDto> = ({ x, y }) => (
  <Cell x={x} y={y} key={serialize({ x, y })}>
    <Targeting />
  </Cell>
)
