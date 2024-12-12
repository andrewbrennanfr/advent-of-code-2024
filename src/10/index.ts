import * as U from "@/utils"

const parse = (input: string): number[][] => U.map2D(U.grid(input, ""), Number)

const getStarts = (grid: number[][]): U.Position[] =>
    U.map2D(grid, U.index)
        .flat()
        .filter((position) => U.cell(grid, position) === 0)

const getEnds = (grid: number[][], position: U.Position): U.Position[] => {
    const current = U.guard(U.cell(grid, position))

    if (current === 9) return [position]

    const siblings = Object.values(U.siblings(position))
    const gridSiblings = siblings.filter((sibling) =>
        U.isDefined(U.cell(grid, sibling)),
    )
    const validNextSteps = gridSiblings.filter(
        (sibling) => U.cell(grid, sibling) === current + 1,
    )

    if (validNextSteps.length === 0) return []

    return validNextSteps.flatMap(U.λ(getEnds, grid))
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const grid = parse(input)

    const bounds = getStarts(grid).flatMap((start) =>
        getEnds(grid, start).map((end) => ({ end, start })),
    )

    return U.unique(
        bounds,
        ({ end, start }) => `${start.r}_${start.c}_${end.r}_${end.c}`,
    ).length
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const grid = parse(input)

    return getStarts(grid).flatMap(U.λ(getEnds, grid)).length
}
