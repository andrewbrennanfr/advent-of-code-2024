import * as U from "@/utils"

const parse = (input: string): U.Grid<number> => U.map2D(U.grid(input), Number)

const getStarts = (grid: U.Grid<number>): U.Position[] =>
    U.map2D(grid, (_, index) => index)
        .flat()
        .filter((position) => U.cell(grid, position) === 0)

const getEnds = (grid: U.Grid<number>, position: U.Position): U.Position[] => {
    const current = U.guard(U.cell(grid, position))

    if (current === 9) return [position]

    const { east, north, south, west } = U.square(position)

    const siblings = [east, north, south, west].filter((sibling) =>
        U.defined(U.cell(grid, sibling)),
    )
    const nextSiblings = siblings.filter(
        (sibling) => U.cell(grid, sibling) === current + 1,
    )

    if (nextSiblings.length === 0) return []

    return nextSiblings.flatMap((sibling) => getEnds(grid, sibling))
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const grid = parse(input)

    return U.unique(
        getStarts(grid).flatMap((start) =>
            getEnds(grid, start).map((end) => ({ end, start })),
        ),
        ({ end, start }) => U.hash(start.r, start.c, end.r, end.c),
    ).length
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const grid = parse(input)

    return getStarts(grid).flatMap((position) => getEnds(grid, position)).length
}
