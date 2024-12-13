import { at, count, order } from "@/array"
import { clockwise, type Grid, makeGrid, mapGrid } from "@/grid"
import { distance, product, sum } from "@/number"

const parse = (input: string): Grid<number> => {
    const grid = makeGrid(input, / +/u)
    const numbers = mapGrid(grid, Number)
    const sideways = clockwise(numbers)

    return sideways.map(order)
}

const solve = (
    grid: Grid<number>,
    combine: (
        left: number,
        right: number,
        arrays: [number[], number[]],
    ) => number,
): number => {
    const numbers = grid.reduce((leftNumbers, rightNumbers) =>
        leftNumbers.map((left, index) => {
            const right = at(rightNumbers, index)

            return combine(left, right, [leftNumbers, rightNumbers])
        }),
    )

    return sum(numbers)
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => solve(parse(input), distance)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(parse(input), (left, __, [, rightNumbers]) => {
        const counts = count(rightNumbers, (right) => right === left)

        return product([left, counts])
    })
