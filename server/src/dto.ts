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
  hasWon?: boolean
}

export enum Player {
  A,
  B,
}

export interface GetGameRequest {
  gameId: number
  player: Player
}

export interface GetGameResponse {
  success: boolean
  message: string
  game: ClientGameDto
}

export interface FireShotRequest {
  gameId: number
  player: Player
  target: CoordinateDto
}

export interface FireShotResponse {
  success: boolean
  message: string
  wasHit?: boolean
}

export interface ShotReceivedSubscription {
  gameId: number
  player: Player
}

export interface ShotReceivedEvent {
  target: CoordinateDto
}

export interface ServerGameDto {
  boardA: BoardDto
  boardB: BoardDto
  turn: Player
}
