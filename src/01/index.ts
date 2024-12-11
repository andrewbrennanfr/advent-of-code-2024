import * as U from "@/utils"

const parse = (input: string): number[][] => {
    const grid = U.map2D(U.grid(input, / +/u), U.int)

    return U.map(U.clockwise(grid), U.order)
}

const solve = (
    grid: number[][],
    combine: (
        left: number,
        right: number,
        arrays: [number[], number[]],
    ) => number,
): number => U.sum(U.converge(grid, combine))

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => solve(parse(input), U.distance)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(parse(input), (left, _, pair) => {
        const rightArray = U.last(pair)
        const leftCount = U.count(rightArray, U.λ(U.isEqual, left))

        return U.multiply(left, leftCount)
    })
