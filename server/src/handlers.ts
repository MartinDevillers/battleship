import { NextFunction, Request, Response } from "express"
import { FireShotRequest, FireShotResponse, GetGameRequest, GetGameResponse } from "./dto"
import Service from "./service"

const service = new Service()

export const corsHandler = (req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "https://my-battleship-client.herokuapp.com")
  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Headers", "Content-Type")
  next()
}

// Simple sanity check to see if the API is alive
export const rootHandler = (_req: Request, res: Response): Response => {
  return res.send("API is working 🤓")
}

// Handler for getting game data
export const getGameHandler = async (
  req: Request<GetGameRequest>,
  res: Response<GetGameResponse>
): Promise<Response> => {
  const { gameId, player } = req.params
  const game = await service.getGame(+gameId, +player) // the plus is to cast the string to a number since Express params are actually strings
  const response: GetGameResponse = {
    success: true,
    message: `Test`,
    game,
  }
  return res.json(response)
}

// Handler for processing a shot
export const fireShotHandler = async (
  req: Request<FireShotRequest>,
  res: Response<FireShotResponse>
): Promise<Response> => {
  const { gameId, player } = req.params
  // Not really happy with this mix of query string and post body parameters
  const response = await service.processShot(+gameId, +player, req.body.target)
  return res.json(response)
}

// Handler for receiving a shot event
export const shotReceivedHandler = async (req: Request, res: Response) => {
  const { gameId, player } = req.params
  res.set({
    "Cache-Control": "no-cache, no-transform",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  })
  res.flushHeaders()

  // Tell the client to retry every 10 seconds if connectivity is lost
  res.write("retry: 10000\n\n")

  service.subscribeToReceivedShots(+gameId, +player, (event) => {
    const data = JSON.stringify(event)
    res.write(`data: ${data}\n\n`)
  })
}
