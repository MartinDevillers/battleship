import express from "express"
import { rootHandler, getGameHandler, fireShotHandler, shotReceivedHandler, corsHandler } from "./handlers"

const app = express()
const port = process.env.PORT || "8000"

app.use(express.json())
app.use(corsHandler)
app.get("/", rootHandler)
app.get("/:gameId/:player", getGameHandler)
app.post("/:gameId/:player/fire-shot", fireShotHandler)
app.get("/:gameId/:player/shot-received", shotReceivedHandler)

app.listen(port, () => {
  // if (err) return console.error(err);
  return console.log(`Server is listening on ${port}`)
})
