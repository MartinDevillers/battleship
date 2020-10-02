import FleetArranger from "./fleetArranger"
import {
  ClientGameDto,
  FireShotRequest,
  FireShotResponse,
  GetGameRequest,
  GetGameResponse,
  Player,
  ShotReceivedEvent,
} from "../dto"
import { contains, invert, random, serialize } from "./coordinateUtils"
import { clone, sleep } from "./utils"
import { GameServiceClient } from "./gameServiceClient"

// Service client that pretends to communicate with a real server (but doesn't!)
export default class FakeGameServiceClient implements GameServiceClient {
  // In-memory database of games
  readonly database: Map<number, ClientGameDto>

  onShotReceivedSubscription: (event: ShotReceivedEvent) => void

  constructor() {
    this.database = new Map<number, ClientGameDto>()
    this.onShotReceivedSubscription = (): void => {}
  }

  // Returns the game state for the given id (or creates a new one if it doesn't exist)
  async getGame({ gameId, player }: GetGameRequest): Promise<GetGameResponse> {
    console.log(`Getting game state for ${gameId} ${player}`)
    if (!this.database.has(gameId)) {
      const clientGameDto: ClientGameDto = {
        playerBoard: {
          ships: [],
          shots: [],
        },
        enemyBoard: {
          ships: [],
          shots: [],
        },
        isMyTurn: true,
      }
      const playerFleetArranger = new FleetArranger()
      clientGameDto.playerBoard.ships = playerFleetArranger.arrange()
      const enemyFleetArranger = new FleetArranger()
      clientGameDto.enemyBoard.ships = enemyFleetArranger.arrange()

      this.database.set(gameId, clientGameDto)
    }

    // Let's pretend we're talking to a slow server
    await sleep()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const clientGameDto = clone(this.database.get(gameId)!)

    // Show only sunk ships on the enemy board
    const enemyHitCoordinates = clientGameDto.enemyBoard.shots.filter((s) => s.isHit).map((s) => s.target)
    const enemySunkShips = clientGameDto.enemyBoard.ships.filter((s) =>
      s.positions.every((p) => contains(enemyHitCoordinates, p))
    )
    clientGameDto.enemyBoard.ships = enemySunkShips

    // Check whether all enemy ships have been sunk
    if (enemySunkShips.length === 5) {
      clientGameDto.isMyTurn = false
      clientGameDto.hasWon = true
    }

    // Check whether all player ships have been sunk
    const playerShipCoordinates = clientGameDto.playerBoard.ships.flatMap((s) => s.positions)
    const playerShotCoordinates = clientGameDto.playerBoard.shots.map((s) => s.target)
    const hasPlayerLost = playerShipCoordinates.every((s) => contains(playerShotCoordinates, s))

    if (hasPlayerLost) {
      clientGameDto.isMyTurn = false
      clientGameDto.hasWon = false
    }

    return {
      success: true,
      message: `Retrieved game state for${gameId} ${player}`,
      game: clientGameDto,
    }
  }

  // Fires a shot at the specified target
  async fireShot({ gameId, target }: FireShotRequest): Promise<FireShotResponse> {
    const clientGameDto = this.database.get(gameId)

    // Check if we still have this game's data
    if (clientGameDto === undefined) {
      const message = "Game with that id doesn't exist in internal database!"
      console.warn(message)
      return { success: false, message }
    }

    // Check if it's the player's turn
    if (!clientGameDto.isMyTurn) {
      const message = "Player fired shot, but it isn't his/her turn!"
      console.warn(message)
      return { success: false, message }
    }

    // Check if that position hasn't been fired on already
    const enemyShotCoordinates = clientGameDto.enemyBoard.shots.map((s) => s.target)
    const isPositionAlreadyShot = contains(enemyShotCoordinates, target)
    if (isPositionAlreadyShot) {
      const message = `Player fired shot at position (${serialize(target)}) that has already been fired upon!`
      console.warn(message)
      return { success: false, message }
    }

    // Switch turn to the enemy
    clientGameDto.isMyTurn = false

    // Check if the shot was a hit or miss
    const enemyShipCoordinates = clientGameDto.enemyBoard.ships.flatMap((s) => s.positions)
    const isHit = contains(enemyShipCoordinates, target)

    // Register the shot on the enemy's board
    clientGameDto.enemyBoard.shots.push({
      target,
      isHit,
    })

    // Schedule a return shot in the nearby future
    setTimeout(() => this.returnFire(gameId), Math.random() * 500 + 300)

    // Let's pretend we're talking to a slow server
    await sleep()

    return {
      success: true,
      message: `Successfully hit enemy ship at ${serialize(target)}`,
      wasHit: isHit,
    }
  }

  subscribeToReceivedShots(gameId: number, player: Player, handler: (event: ShotReceivedEvent) => void): void {
    this.onShotReceivedSubscription = handler
  }

  unsubscribeFromReceivedShots(): void {
    this.onShotReceivedSubscription = (): void => {}
  }

  // Simulates the enemy firing a shot at the player
  returnFire(gameId: number): void {
    const clientGameDto = this.database.get(gameId)
    if (clientGameDto === undefined) {
      console.error(`Failed to return fire. Cannot find game with ID: ${gameId}`)
      return
    }
    // Grab all previous shots made by the enemy
    const playerShotCoordinates = clientGameDto.playerBoard.shots.map((s) => s.target)
    // Determine remaining targets
    const playerTargetCoordinates = invert(playerShotCoordinates)
    // Randomly grab a target @todo implement a more intelligent enemy AI (e.g. track hit ships)
    const target = random(playerTargetCoordinates)
    // Check if this target will hit any of the player's ships
    const playerShipCoordinates = clientGameDto.playerBoard.ships.flatMap((s) => s.positions)
    const isHit = contains(playerShipCoordinates, target)
    // Register the shot on the player's board
    clientGameDto.playerBoard.shots.push({ target, isHit })
    // Check whether the game is over
    playerShotCoordinates.push(target)
    const isGameOver = isHit && playerShipCoordinates.every((s) => contains(playerShotCoordinates, s))
    // Switch turn to the player
    clientGameDto.isMyTurn = !isGameOver
    // Let the player know that the enemy has fired a shot
    this.onShotReceivedSubscription({ target })
  }
}
