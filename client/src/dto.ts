export interface CoordinateDto {
  x: number
  y: number
}

export interface ShotDto {
  target: CoordinateDto
  isHit: boolean
}

export interface ShipDto {
  name: string
  positions: CoordinateDto[]
}

export interface BoardDto {
  ships: ShipDto[]
  shots: ShotDto[]
}

export interface ClientGameDto {
  playerBoard: BoardDto
  enemyBoard: BoardDto
  isMyTurn: boolean
}

export enum Player {
  A,
  B,
}

export interface FireShotRequest {
  gameId: string
  player: Player
  target: CoordinateDto
}

export interface FireShotResponse {
  success: boolean
  message: string
  wasHit?: boolean
}

export interface ShotReceivedEvent {
  target: CoordinateDto
}
