import { count } from "@/array"
import {
    clockwise,
    east,
    type Grid,
    makeGrid,
    mapGrid,
    northEast,
    northWest,
    pathGrid,
    type Position,
    southEast,
    southWest,
    unsafeAtPosition,
} from "@/grid"
import { sum } from "@/number"

const parse = (input: string): Grid<string> => makeGrid(input)

const solve = (
    grid: Grid<string>,
    degrees: number,
    evaluate: (cell: string, position: Position, grid: Grid<string>) => number,
): number => {
    if (degrees === 360) return 0

    const numbers = mapGrid(grid, evaluate).flat()
    const rotatedGrid = clockwise(grid, degrees + 90)

    return sum(numbers) + solve(rotatedGrid, degrees + 90, evaluate)
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number =>
    solve(parse(input), 0, (cell, position, grid) => {
        if (cell !== "X") return 0

        const directions = [east, southEast]

        return count(directions, (direction) => {
            const path = pathGrid(position, direction, 3)
            const cells = path.map((position_) =>
                unsafeAtPosition(grid, position_),
            )

            return cells.join("") === "XMAS"
        })
    })

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(parse(input), 0, (cell, position, grid) => {
        if (cell !== "A") return 0

        const northWestPosition = northWest(position)
        const southWestPosition = southWest(position)

        const paths = [
            pathGrid(northWestPosition, southEast, 2),
            pathGrid(southWestPosition, northEast, 2),
        ]

        const isCrossMas = paths.every((path) => {
            const cells = path.map((position_) =>
                unsafeAtPosition(grid, position_),
            )

            return cells.join("") === "MAS"
        })

        return Number(isCrossMas)
    })
