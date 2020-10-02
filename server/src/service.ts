import { ClientGameDto, CoordinateDto, FireShotResponse, Player, ShotReceivedEvent } from "./dto"
import Storage from "./storage"
import { contains, serialize } from "./coordinateUtils"
import FleetArranger from "./fleetArranger"

// Service for handling server-side game logic
export default class Service {
  readonly storage = new Storage()

  readonly fleetArranger = new FleetArranger()

  readonly shotReceivedSubscriptions = new Map<string, (event: ShotReceivedEvent) => void>()

  // Retrieves game state (or creates a new game if none found)
  async getGame(gameId: number, player: Player): Promise<ClientGameDto> {
    let serverGameDto = await this.storage.loadGame(gameId)

    // No existing game, so let's create a new one and save it back to the database
    if (serverGameDto === null) {
      serverGameDto = {
        boardA: {
          ships: this.fleetArranger.arrange(),
          shots: [],
        },
        boardB: {
          ships: this.fleetArranger.arrange(),
          shots: [],
        },
        turn: player,
      }
      await this.storage.saveGame(gameId, serverGameDto)
    }

    // Determine the correct perspective
    const playerBoard = player === Player.A ? serverGameDto.boardA : serverGameDto.boardB
    const enemyBoard = player === Player.A ? serverGameDto.boardB : serverGameDto.boardA

    // Show only sunk ships on the enemy board
    const enemyHitCoordinates = enemyBoard.shots.filter((s) => s.isHit).map((s) => s.target)
    const enemySunkShips = enemyBoard.ships.filter((s) => s.positions.every((p) => contains(enemyHitCoordinates, p)))
    enemyBoard.ships = enemySunkShips

    let hasWon

    // Check whether all enemy ships have been sunk
    if (enemySunkShips.length === 5) {
      hasWon = true
    }

    // Check whether all player ships have been sunk
    const playerShipCoordinates = playerBoard.ships.flatMap((s) => s.positions)
    const playerShotCoordinates = playerBoard.shots.map((s) => s.target)
    const hasPlayerLost = playerShipCoordinates.every((s) => contains(playerShotCoordinates, s))

    if (hasPlayerLost) {
      hasWon = false
    }

    return {
      playerBoard,
      enemyBoard,
      isMyTurn: serverGameDto.turn === player,
      hasWon,
    }
  }

  // Processes a shot fired by the player
  async processShot(gameId: number, player: Player, target: CoordinateDto): Promise<FireShotResponse> {
    const serverGameDto = await this.storage.loadGame(gameId)

    // Check if we have this game's data
    if (serverGameDto === null) {
      const message = "Game with that id doesn't exist in database!"
      console.warn(message)
      return { success: false, message }
    }

    // Check if it's the player's turn
    if (serverGameDto.turn !== player) {
      const message = "Player fired shot, but it isn't their turn!"
      console.warn(message)
      return { success: false, message }
    }

    // Grab the *other* player's board (we're not shooting at ourselves)
    const targetedBoard = serverGameDto.turn === Player.A ? serverGameDto.boardB : serverGameDto.boardA

    // Check if that position hasn't been fired on already
    const shotCoordinates = targetedBoard.shots.map((s) => s.target)
    const isPositionAlreadyShot = contains(shotCoordinates, target)
    if (isPositionAlreadyShot) {
      const message = `Player fired shot at position (${serialize(target)}) that has already been fired upon!`
      console.warn(message)
      return { success: false, message }
    }

    // Switch turn to the other player
    serverGameDto.turn = serverGameDto.turn === Player.A ? Player.B : Player.A

    // Check if the shot was a hit or miss
    const enemyShipCoordinates = targetedBoard.ships.flatMap((s) => s.positions)
    const isHit = contains(enemyShipCoordinates, target)

    // Register the shot on the targeted board
    targetedBoard.shots.push({
      target,
      isHit,
    })

    // Persist the game state back to the database
    const success = await this.storage.saveGame(gameId, serverGameDto)

    // Let the other player know we've shot at them
    this.publishReceivedShotEvent(gameId, serverGameDto.turn, { target })

    return {
      success,
      message: `Processed shot at ${serialize(target)}`,
      wasHit: isHit,
    }
  }

  // Subscribe to shot events
  subscribeToReceivedShots(gameId: number, player: Player, handler: (event: ShotReceivedEvent) => void): void {
    const key = `${gameId}/${player}`
    this.shotReceivedSubscriptions.set(key, handler)
  }

  // Publish a shot event
  publishReceivedShotEvent(gameId: number, player: Player, event: ShotReceivedEvent): void {
    const key = `${gameId}/${player}`
    const subscription = this.shotReceivedSubscriptions.get(key)
    if (subscription !== undefined) {
      subscription(event)
    }
  }
}
