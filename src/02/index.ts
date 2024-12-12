import * as U from "@/utils"

const parse = (input: string): U.Grid<number> =>
    U.map2D(U.grid(input, " "), Number)

const safe = (numbers: number[]): boolean =>
    (numbers.every(
        (number, index) => index === 0 || number >= U.at(numbers, index - 1),
    ) ||
        numbers.every(
            (number, index) =>
                index === 0 || number <= U.at(numbers, index - 1),
        )) &&
    numbers.every(
        (number, index) =>
            index === 0 ||
            U.between(1, U.distance(number, U.at(numbers, index - 1)), 3),
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
        numbers.some((_, index) =>
            safe([...numbers.slice(0, index), ...numbers.slice(index + 1)]),
        ),
    )
