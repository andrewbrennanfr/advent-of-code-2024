import * as U from "@/utils"

const parse = (input: string): number[][] => U.map2D(U.grid(input, " "), Number)

const safe = (numbers: number[]): boolean =>
    (U.ascending(numbers) || U.descending(numbers)) &&
    U.follows(numbers, (left, right) =>
        U.between(1, U.distance(left, right), 3),
    )

const solve = (
    grid: number[][],
    safe: (numbers: number[]) => boolean,
): number => U.count(grid, safe)

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => solve(parse(input), safe)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(parse(input), (numbers) =>
        numbers.map(U.index).map(U.λ(U.without, numbers)).some(safe),
    )
