import { FireShotRequest, FireShotResponse, GetGameRequest, GetGameResponse, Player, ShotReceivedEvent } from "../dto"
import RealGameServiceClient from "./realGameServiceClient"
import FakeGameServiceClient from "./fakeGameServiceClient"

export interface GameServiceClient {
  getGame(request: GetGameRequest): Promise<GetGameResponse>
  fireShot(request: FireShotRequest): Promise<FireShotResponse>
  subscribeToReceivedShots(gameId: number, player: Player, handler: (event: ShotReceivedEvent) => void): void
  unsubscribeFromReceivedShots(): void
}

export default class DynamicGameServiceClient implements GameServiceClient {
  // Client for communicating with the server
  readonly realGameServiceClient = new RealGameServiceClient()

  // Client for simulating a local game
  readonly fakeGameServiceClient = new FakeGameServiceClient()

  getGame(request: GetGameRequest): Promise<GetGameResponse> {
    return +request.gameId === 0
      ? this.fakeGameServiceClient.getGame(request)
      : this.realGameServiceClient.getGame(request)
  }

  fireShot(request: FireShotRequest): Promise<FireShotResponse> {
    return +request.gameId === 0
      ? this.fakeGameServiceClient.fireShot(request)
      : this.realGameServiceClient.fireShot(request)
  }

  subscribeToReceivedShots(gameId: number, player: Player, handler: (event: ShotReceivedEvent) => void): void {
    return +gameId === 0
      ? this.fakeGameServiceClient.subscribeToReceivedShots(gameId, player, handler)
      : this.realGameServiceClient.subscribeToReceivedShots(gameId, player, handler)
  }

  unsubscribeFromReceivedShots(): void {
    this.fakeGameServiceClient.unsubscribeFromReceivedShots()
    this.realGameServiceClient.unsubscribeFromReceivedShots()
  }
}
