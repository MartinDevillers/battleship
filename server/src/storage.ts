import { Database } from "sqlite3"
import { ServerGameDto } from "./dto"

// Storage class for handling game state persistence
export default class Storage {
  readonly database: Database

  // The database only contains one table
  static readonly schema = `CREATE TABLE IF NOT EXISTS Games (
        id integer NOT NULL PRIMARY KEY,
        player integer NOT NULL,
        data text NOT NULL
    );`

  constructor() {
    this.database = new Database(":memory:")
    this.database.run(Storage.schema)
  }

  // Load game state from database
  async loadGame(id: number): Promise<ServerGameDto | null> {
    return new Promise((resolve, reject) => {
      this.database.get(`SELECT data FROM Games WHERE id = ?`, [id], (err, row) => {
        if (err) {
          console.error(err)
          reject(err)
        } else if (row === undefined) {
          resolve(null)
        } else {
          resolve(JSON.parse(row.data))
        }
      })
    })
  }

  // Save game state to database (overwriting any existing state)
  async saveGame(id: number, serverGameDto: ServerGameDto): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // Perform atomic UPSERT operation using player turn as a failsafe https://sqlite.org/lang_UPSERT.html
      const query = `INSERT INTO Games(id, player, data)
          VALUES(?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            player = excluded.player,
            data = excluded.data
          WHERE excluded.player <> Games.player;`
      this.database.run(query, [id, serverGameDto.turn, JSON.stringify(serverGameDto)], (err) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          resolve(true)
        }
      })
    })
  }
}
