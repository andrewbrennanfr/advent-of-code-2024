import { at } from "@/array"
import { distance } from "@/number"
import { memoize, safe } from "@/utils"

export type Grid<T> = T[][]

export type Position = Record<"c" | "r", number>

/* -------------------------------------------------------------------------- */

export const north = ({ r, ...position }: Position): Position => ({
    ...position,
    r: r - 1,
})
export const east = ({ c, ...position }: Position): Position => ({
    ...position,
    c: c + 1,
})
export const south = ({ r, ...position }: Position): Position => ({
    ...position,
    r: r + 1,
})
export const west = ({ c, ...position }: Position): Position => ({
    ...position,
    c: c - 1,
})

export const northEast = (position: Position): Position => north(east(position))
export const southEast = (position: Position): Position => south(east(position))
export const southWest = (position: Position): Position => south(west(position))
export const northWest = (position: Position): Position => north(west(position))

export const square = (
    position: Position,
): Record<
    | "east"
    | "north"
    | "northEast"
    | "northWest"
    | "south"
    | "southEast"
    | "southWest"
    | "west",
    Position
> => ({
    east: east(position),
    north: north(position),
    northEast: northEast(position),
    northWest: northWest(position),
    south: south(position),
    southEast: southEast(position),
    southWest: southWest(position),
    west: west(position),
})

/* -------------------------------------------------------------------------- */

export const atPosition = <T>(
    grid: Grid<T>,
    position: Position,
): NonNullable<T> => safe(unsafeAtPosition(grid, position))

export const clockwise = <T>(
    [first = [], ...grid]: Grid<T>,
    degrees = 90,
): Grid<T> => {
    if (degrees === 0) return [first, ...grid]

    return clockwise(
        first.map((cell, index) =>
            [cell, ...grid.map((row) => at(row, index))].toReversed(),
        ),
        degrees - 90,
    )
}

export const makeGrid = (
    string: string,
    separator: RegExp | string = "",
): Grid<string> =>
    string
        .trim()
        .split("\n")
        .map((line) => line.split(separator))

export const manhattanDistance = (left: Position, right: Position): number =>
    distance(left.r, right.r) + distance(left.c, right.c)

export const mapGrid = <T, U>(
    grid: Grid<T>,
    iteratee: (cell: T, position: Position, grid: Grid<T>) => U,
): Grid<U> =>
    grid.map((row, r) => row.map((cell, c) => iteratee(cell, { c, r }, grid)))

export const pathGrid = memoize(
    (
        start: Position,
        direction: (position: Position) => Position,
        moves: number,
    ): Position[] => {
        if (moves === 0) return [start]

        return [start, ...pathGrid(direction(start), direction, moves - 1)]
    },
)

export const unsafeAtPosition = <T>(
    grid: Grid<T>,
    { c, r }: Position,
): T | undefined => grid[r]?.[c]
