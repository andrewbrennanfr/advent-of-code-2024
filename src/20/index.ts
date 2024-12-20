import { at, count } from "@/array"
import {
    atPosition,
    cross,
    type Grid,
    makeGrid,
    manhattanDistance,
    mapGrid,
    type Position,
    unsafeAtPosition,
} from "@/grid"
import { mutateGrid, mutateSet } from "@/mutation"
import { makeHash, safe } from "@/utils"

const parse = (
    input: string,
): { end: Position; grid: Grid<string>; start: Position } => {
    const grid = makeGrid(input)

    const startRowIndex = grid.findIndex((row) => row.includes("S"))
    const endRowIndex = grid.findIndex((row) => row.includes("E"))

    const start = { c: at(grid, startRowIndex).indexOf("S"), r: startRowIndex }
    const end = { c: at(grid, endRowIndex).indexOf("E"), r: endRowIndex }

    return { end, grid, start }
}

const markPath = (
    grid: Grid<string>,
    start: Position,
    end: Position,
): Grid<string> =>
    mutateGrid(
        grid,
        getPath(grid, start, end).map((position, index) => [
            position,
            String(index),
        ]),
    )

const getPath = (
    grid: Grid<string>,
    current: Position,
    end: Position,
    visited: Set<string> = new Set(),
    // eslint-disable-next-line @typescript-eslint/max-params
): Position[] => {
    if (current.r === end.r && current.c === end.c) return [current]

    const nextVisited = mutateSet(visited, [makeHash(current.r, current.c)])

    const next = Object.values(cross(current)).find(
        (position) =>
            !nextVisited.has(makeHash(position.r, position.c)) &&
            (unsafeAtPosition(grid, position) === "." ||
                unsafeAtPosition(grid, position) === "E" ||
                unsafeAtPosition(grid, position) === "S"),
    )

    return [current, ...getPath(grid, safe(next), end, nextVisited)]
}

const getCheatPositions = (
    __: Grid<string>,
    spaces: Position[],
    current: Position,
    size: number,
    // eslint-disable-next-line @typescript-eslint/max-params
): Position[] => {
    const everyCellWithinDistance = spaces.filter(
        (position) => manhattanDistance(position, current) <= size,
    )

    return everyCellWithinDistance
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string, saves: number, moves = 2): number => {
    const { end, grid, start } = parse(input)

    const markedGrid = markPath(structuredClone(grid), start, end)

    const spaces = mapGrid(grid, (cell, position) => ({ cell, position }))
        .flat()
        .filter(({ cell }) => cell !== "#")
        .map(({ position }) => position)

    const path = getPath(grid, start, end)

    const pathCheatsCosts = path.flatMap((position) => {
        const cheats = getCheatPositions(markedGrid, spaces, position, moves)
        const cost = Number(atPosition(markedGrid, position))

        const cheatCosts = cheats.map((cheat) => {
            const distance = manhattanDistance(position, cheat)

            return Number(atPosition(markedGrid, cheat)) - (cost + distance)
        })

        return cheatCosts.filter((cheatCost) => cheatCost > 0)
    })

    return count(pathCheatsCosts, (cost) => cost >= saves)
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string, saves: number): number =>
    part01(input, saves, 20)
