import * as U from "@/utils"

const parse = (input: string): U.Grid<number> =>
    U.clockwise(U.map2D(U.grid(input, / +/u), Number)).map(U.order)

const solve = (
    grid: U.Grid<number>,
    combine: (
        left: number,
        right: number,
        arrays: [number[], number[]],
    ) => number,
): number =>
    U.sum(
        grid.reduce((left, right) =>
            left.map((_, index) =>
                combine(U.at(left, index), U.at(right, index), [left, right]),
            ),
        ),
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => solve(parse(input), U.distance)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(parse(input), (left, _, [, rightArray]) =>
        U.product([left, U.count(rightArray, (right) => right === left)]),
    )
