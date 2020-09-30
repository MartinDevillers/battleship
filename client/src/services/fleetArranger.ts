import { ShipDto } from "../dto"
import { clone } from "./utils"

// Class for placing a series of ships on the grid. Used to initialize a game.
export default class FleetArranger {
  // Traditional fleet consisting of 5x1, 4x1, 3x1, 3x1 and 2x1
  static readonly DEFAULT_FLEET: ShipDto[] = [
    {
      name: "Carrier",
      positions: [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 1, y: 4 },
        { x: 1, y: 5 },
      ],
    },
    {
      name: "Battleship",
      positions: [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 1, y: 4 },
      ],
    },
    {
      name: "Destroyer",
      positions: [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
      ],
    },
    {
      name: "Submarine",
      positions: [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
      ],
    },
    {
      name: "Patrol Boat",
      positions: [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
    },
  ]

  static readonly BOARD_SIZE = 10

  readonly fleet: ShipDto[]

  constructor() {
    this.fleet = clone(FleetArranger.DEFAULT_FLEET)
  }

  // Returns a fleet of ships that have been arranged on the board
  arrange(): ShipDto[] {
    // Naive algorithm. Just keep making random arrangements until it's valid.
    let generation = 0
    while (!this.isValidArrangement()) {
      this.randomlyArrangeFleet()
      generation++
    }
    console.log(`Arranged fleet in ${generation} iterations`)
    return this.fleet
  }

  // Returns true if the ships have been arranged in a correct manner (see constraints for details)
  isValidArrangement(): boolean {
    const positions = this.fleet.flatMap((ship) => ship.positions)
    const serializedPositions = positions.map((coordinate) => `${coordinate.x},${coordinate.y}`)
    // None of the ships may overlap
    const hasNoOverlappingPositions = new Set(serializedPositions).size === positions.length
    // None of the ships may be "outside" the game area
    const hasNoOutOfBoundPositions = positions.every(
      (coordinate) =>
        coordinate.x >= 1 &&
        coordinate.x <= FleetArranger.BOARD_SIZE &&
        coordinate.y >= 1 &&
        coordinate.y <= FleetArranger.BOARD_SIZE
    )
    return hasNoOverlappingPositions && hasNoOutOfBoundPositions
  }

  // Randomly moves all ships around the board
  randomlyArrangeFleet(): void {
    for (const ship of this.fleet) {
      const x = Math.floor(Math.random() * FleetArranger.BOARD_SIZE)
      const y = Math.floor(Math.random() * FleetArranger.BOARD_SIZE)
      const xDiff = x - ship.positions[0].x
      const yDiff = y - ship.positions[0].y
      // @todo add support for rotating ships
      ship.positions.forEach((c) => {
        c.x += xDiff
        c.y += yDiff
      })
    }
  }
}
