import * as U from "@/utils"

const parse = (input: string): number[][] =>
    U.clockwise(U.map2D(U.grid(input, / +/u), Number)).map((numbers) =>
        U.sort(numbers),
    )

const solve = (
    grid: number[][],
    combine: (left: number[], right: number[], index: number) => number,
): number => U.sum(U.converge(grid, combine))

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number =>
    solve(parse(input), (left, right, index) =>
        U.distance(U.at(left, index), U.at(right, index)),
    )

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(
        parse(input),
        (left, right, index) =>
            U.at(left, index) *
            U.count(right, (number) => number === U.at(left, index)),
    )
