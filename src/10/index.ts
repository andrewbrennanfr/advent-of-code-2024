import { unique } from "@/array"
import {
    atPosition,
    type Grid,
    makeGrid,
    mapGrid,
    type Position,
    square,
    unsafeAtPosition,
} from "@/grid"
import { isDefined, makeHash } from "@/utils"

const parse = (input: string): Grid<number> => mapGrid(makeGrid(input), Number)

const getStarts = (grid: Grid<number>): Position[] => {
    const gridIndexes = mapGrid(grid, (__, index) => index)
    const positions = gridIndexes.flat()

    return positions.filter((position) => atPosition(grid, position) === 0)
}

const getEnds = (grid: Grid<number>, position: Position): Position[] => {
    const current = atPosition(grid, position)

    if (current === 9) return [position]

    const { east, north, south, west } = square(position)

    const siblings = [east, north, south, west].filter((sibling) =>
        isDefined(unsafeAtPosition(grid, sibling)),
    )
    const nextSiblings = siblings.filter(
        (sibling) => atPosition(grid, sibling) === current + 1,
    )

    if (nextSiblings.length === 0) return []

    return nextSiblings.flatMap((sibling) => getEnds(grid, sibling))
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const grid = parse(input)

    const starts = getStarts(grid)

    const paths = starts.flatMap((start) => {
        const ends = getEnds(grid, start)

        return ends.map((end) => ({ end, start }))
    })

    const uniquePaths = unique(paths, ({ end, start }) =>
        makeHash(start.r, start.c, end.r, end.c),
    )

    return uniquePaths.length
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const grid = parse(input)

    const starts = getStarts(grid)
    const ends = starts.flatMap((position) => getEnds(grid, position))

    return ends.length
}
