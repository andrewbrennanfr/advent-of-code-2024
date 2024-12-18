import { at, count } from "@/array"
import {
    atPosition,
    type Grid,
    mapGrid,
    type Position,
    square,
    unsafeAtPosition,
} from "@/grid"
import { mutateGrid, mutateSet } from "@/mutation"
import { middle } from "@/number"
import { matches } from "@/string"
import { always, isDefined, makeHash } from "@/utils"

const parse = (input: string): Position[] => {
    const positions = matches(input.trim(), /(?<x>\d+),(?<y>\d+)/gu)

    return positions.map(({ groups }) => ({
        c: Number(groups["x"]),
        r: Number(groups["y"]),
    }))
}

const generateGrid = (
    data: Position[],
    size: number,
    bytes: number,
): Grid<string> => {
    const firstBytes = data.slice(0, bytes)
    const firstByteHashes = new Set(
        firstBytes.map(({ c, r }) => makeHash(r, c)),
    )

    const grid = Array.from(
        { length: size },
        always(Array.from({ length: size }, always("."))),
    )

    return mapGrid(grid, (cell, { c, r }) =>
        firstByteHashes.has(makeHash(r, c)) ? "#" : cell,
    )
}

const findPathLength = (
    grid: Grid<string>,
    end: Position,
    costs: Grid<number>,
    queue: Position[],
    visited: Set<string>,
    // eslint-disable-next-line @typescript-eslint/max-params
): { blocked: boolean; result: number } => {
    if (queue.length === 0)
        return {
            blocked: true,
            result: count(grid.flat(), (cell) => cell === "#"),
        }

    const current = at(queue, 0)
    const nextQueue = queue.slice(1)

    const currentHash = makeHash(current.r, current.c)

    if (visited.has(currentHash))
        return findPathLength(grid, end, costs, nextQueue, visited)

    const nextVisited = mutateSet(visited, [currentHash])

    if (current.r === end.r && current.c === end.c)
        return { blocked: false, result: atPosition(costs, current) }

    const surrounding = square(current)
    const nextMoves = [
        surrounding.north,
        surrounding.south,
        surrounding.east,
        surrounding.west,
    ].filter(
        (position) =>
            isDefined(unsafeAtPosition(grid, position)) &&
            atPosition(grid, position) !== "#",
    )

    const currentCost = atPosition(costs, current)
    const nextCosts = mutateGrid(
        costs,
        nextMoves.map((position) => [position, currentCost + 1]),
    )
    const nextNextQueue = [...nextQueue, ...nextMoves].toSorted(
        (left, right) =>
            atPosition(costs, left) < atPosition(costs, right) ? -1
            : atPosition(costs, left) > atPosition(costs, right) ? 1
            : 0,
    )

    return findPathLength(grid, end, nextCosts, nextNextQueue, nextVisited)
}

const searchBlockage = (
    data: Position[],
    size: number,
    bytes: number,
    maxBytes: number,
    // eslint-disable-next-line @typescript-eslint/max-params
): string => {
    const grid = generateGrid(data, size, bytes)
    const start = { c: 0, r: 0 }
    const end = { c: size - 1, r: size - 1 }
    const costs = mapGrid(grid, (__, { c, r }) =>
        r === start.r && c === start.c ? 0 : Infinity,
    )

    const path = findPathLength(grid, end, costs, [start], new Set())
    const coordinates = at(data, bytes - 1)

    if (path.blocked) {
        const grid2 = generateGrid(data, size, bytes - 1)
        const costs2 = mapGrid(grid2, (__, { c, r }) =>
            r === start.r && c === start.c ? 0 : Infinity,
        )

        const path2 = findPathLength(grid2, end, costs2, [start], new Set())

        if (!path2.blocked) return `${coordinates.c},${coordinates.r}`

        return searchBlockage(data, size, bytes - 10, maxBytes)
    }

    return searchBlockage(data, size, bytes + (maxBytes - bytes) / 2, maxBytes)
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string, size: number, bytes: number): number => {
    const data = parse(input)
    const grid = generateGrid(data, size, bytes)
    const start = { c: 0, r: 0 }
    const end = { c: size - 1, r: size - 1 }
    const costs = mapGrid(grid, (__, { c, r }) =>
        r === start.r && c === start.c ? 0 : Infinity,
    )

    return findPathLength(grid, end, costs, [start], new Set()).result
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string, size: number): string => {
    const data = parse(input)

    return searchBlockage(data, size, middle(data.length - 1), data.length - 1)
}
