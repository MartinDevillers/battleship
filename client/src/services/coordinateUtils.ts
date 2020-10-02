import { CoordinateDto } from "../dto"

// Shape of a single dimension
export const dimension = Array.from({ length: 10 }).map((_, x) => x + 1)

// Shape of the complete grid
export const grid = dimension.map((x) => dimension.map((y) => ({ x, y }))).flatMap((c) => c) as CoordinateDto[]

// Used to transform numeric axis to alpha axis
export const alphabet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

// Serializes coordinate to string
export const serialize = (c: CoordinateDto): string => `${alphabet[c.x]}${c.y}`

// Checks two coordinates for equality
export const equals = (left: CoordinateDto, right: CoordinateDto): boolean => left.x === right.x && left.y === right.y

// Checks if the given coordinate is present in the given list of coordinates
export const contains = (list: CoordinateDto[], item: CoordinateDto): boolean => list.some((l) => equals(l, item))

// Inverts the given set of coordinates (= difference between complete grid and given set)
export const invert = (coordinates: CoordinateDto[]): CoordinateDto[] =>
  grid.filter((g) => !coordinates.some((c) => equals(g, c)))

// Gets a random coordinate from the given set of coordinates
export const random = (coordinates: CoordinateDto[]): CoordinateDto =>
  coordinates[Math.floor(Math.random() * coordinates.length)]

// Transposes the given set of coordinates (flips coordinates)
export const transpose = (coordinates: CoordinateDto[]): CoordinateDto[] => coordinates.map((c) => ({ x: c.y, y: c.x }))
