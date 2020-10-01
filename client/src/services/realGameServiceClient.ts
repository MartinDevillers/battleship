import { FireShotRequest, FireShotResponse, GetGameRequest, GetGameResponse, Player, ShotReceivedEvent } from "../dto"
import { GameServiceClient } from "./gameServiceClient"

// Service client that communicates with the real server api
export default class RealGameServiceClient implements GameServiceClient {
  readonly serverHost = process.env.NODE_ENV === "production" ? "https://my-battleship-server.herokuapp.com" : ""

  onShotReceivedSubscription?: EventSource

  // Returns the game state for the given id (or creates a new one if it doesn't exist)
  async getGame({ gameId, player }: GetGameRequest): Promise<GetGameResponse> {
    console.log(`Getting game state for ${gameId} ${player}`)
    const response = await fetch(`${this.serverHost}/${gameId}/${player}`)
    return response.json()
  }

  // Fires a shot at the specified target
  async fireShot({ gameId, player, target }: FireShotRequest): Promise<FireShotResponse> {
    console.log(`Firing shot at ${target.x} ${target.y}`)
    const response = await fetch(`${this.serverHost}/${gameId}/${player}/fire-shot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ target }),
    })
    return response.json()
  }

  // Starts listening to shots made by the other player
  subscribeToReceivedShots(gameId: number, player: Player, handler: (event: ShotReceivedEvent) => void): void {
    this.onShotReceivedSubscription = new EventSource(`${this.serverHost}/${gameId}/${player}/shot-received`)
    this.onShotReceivedSubscription.addEventListener("message", (message) => {
      handler({ target: { x: 0, y: 0 } })
    })
  }

  // Stops listening to shots made by the other player
  unsubscribeFromReceivedShots(): void {
    if (this.onShotReceivedSubscription !== undefined) {
      this.onShotReceivedSubscription.close()
    }
  }
}
