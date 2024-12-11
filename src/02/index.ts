import * as U from "@/utils"

const parse = (input: string): number[][] => U.map2D(U.grid(input, " "), U.int)

const isSafe = (numbers: number[]): boolean =>
    (U.isAscending(numbers) || U.isDescending(numbers)) &&
    U.isFollowing(numbers, (left, right) =>
        U.isBetween(1, U.distance(left, right), 3),
    )

const solve = (
    grid: number[][],
    isSafe: (numbers: number[]) => boolean,
): number => U.count(grid, isSafe)

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => solve(parse(input), isSafe)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const parsed = parse(input)

    return solve(parsed, (numbers) => {
        const indexes = U.map(numbers, U.index)
        const combinations = U.map(indexes, U.λ(U.without, numbers))

        return U.some(combinations, isSafe)
    })
}
