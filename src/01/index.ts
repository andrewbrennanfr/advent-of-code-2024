import * as U from "@/utils"

const parse = (input: string): number[][] =>
    U.clockwise(U.map2D(U.grid(input, / +/u), Number)).map((numbers) =>
        U.sort(numbers),
    )

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
    solve(
        parse(input),
        (left, _, [, array]) =>
            left * U.count(array, (number) => number === left),
    )
