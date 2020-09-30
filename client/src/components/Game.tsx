import React, { useEffect } from "react"
import "./Game.css"
import Board from "./Board"
import { ShipCells, ShotCells, SunkShipCells, TargetCells, TargetingCell } from "./Cells"
import GameServiceClient from "../services/gameServiceClient"
import { equals } from "../services/coordinateUtils"
import { BoardDto, CoordinateDto, Player, ShotReceivedEvent } from "../dto"

// Client for communicating with the server (or simulating a local game)
const gameServiceClient = new GameServiceClient()

// Component for a game of Battleship
const Game: React.FC = () => {
  const emptyBoard: BoardDto = { ships: [], shots: [] }
  const emptyCoordinate: CoordinateDto = { x: 0, y: 0 }

  // Player's board. Should display player's ships and shots from the enemy
  const [playerBoard, setPlayerBoard] = React.useState<BoardDto>(emptyBoard)

  // Enemy's board. Should display player's shots and any sunk ships from the enemy
  const [enemyBoard, setEnemyBoard] = React.useState<BoardDto>(emptyBoard)

  // True if it's the player turn, false if it's the enemy's turn
  const [isMyTurn, setMyTurn] = React.useState(false)

  // True if the game is in a loading state (e.g. communicating with the server)
  const [loading, setLoading] = React.useState(true)

  // Targeting cell is used when a shot has been fired and we're waiting for the server to respond
  const [targeting, setTargeting] = React.useState<CoordinateDto>(emptyCoordinate)

  // Grabs the full state of the game from the server and uses it to render the game
  useEffect(() => {
    if (loading) {
      gameServiceClient.getGame("test", Player.A).then((clientGameDto) => {
        setPlayerBoard(clientGameDto.playerBoard)
        setEnemyBoard(clientGameDto.enemyBoard)
        setMyTurn(clientGameDto.isMyTurn)
        setLoading(false)
        setTargeting(emptyCoordinate)
      })
    }
  }, [loading, emptyCoordinate])

  // Handler for when the player targets a cell on the enemy's board
  const onTargetClicked = (x: number, y: number): void => {
    // Display the targeting indicator
    setTargeting({ x, y })
    // Let the server know that this player has fired a shot
    gameServiceClient.fireShot({ gameId: "test", player: Player.A, target: { x, y } }).then((response) => {
      console.log(`Received fired shot response: ${response.success} ${response.message} ${response.wasHit}`)
      // Refresh the game by pulling the latest state from the server
      setLoading(true)
    })
  }

  // Handler for when the player receives a shot from the enemy
  gameServiceClient.onShotReceived((event: ShotReceivedEvent) => {
    console.log(`Received shot at ${event.target.x}, ${event.target.y}`)
    // Refresh the game by pulling the latest from the server
    setLoading(true)
  })

  return (
    <div className="game">
      <div className={`game-board ${isMyTurn ? "" : "active"}`}>
        <h2>Player</h2>
        <Board>
          <ShipCells ships={playerBoard.ships} />
          <ShotCells shots={playerBoard.shots} />
        </Board>
      </div>
      <div className={`game-board ${isMyTurn ? "active" : ""}`}>
        <h2>Opponent</h2>
        <Board>
          <ShotCells shots={enemyBoard.shots} />
          <SunkShipCells ships={enemyBoard.ships} />
          {!loading && !targeting.x && isMyTurn && (
            <TargetCells shots={enemyBoard.shots} onTargetClicked={onTargetClicked} />
          )}
          {!equals(targeting, emptyCoordinate) && <TargetingCell x={targeting.x} y={targeting.y} />}
        </Board>
      </div>
    </div>
  )
}

export default Game
