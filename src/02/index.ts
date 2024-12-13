import { at, count } from "@/array"
import { type Grid, makeGrid, mapGrid } from "@/grid"
import { distance, isBetween } from "@/number"

const parse = (input: string): Grid<number> =>
    mapGrid(makeGrid(input, " "), Number)

const isSafe = (numbers: number[]): boolean => {
    const isAscending = numbers.every(
        (number, index) => index === 0 || number >= at(numbers, index - 1),
    )

    const isDescending = numbers.every(
        (number, index) => index === 0 || number <= at(numbers, index - 1),
    )

    const isInRange = numbers.every(
        (number, index) =>
            index === 0 ||
            isBetween(1, distance(number, at(numbers, index - 1)), 3),
    )

    return (isAscending || isDescending) && isInRange
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => count(parse(input), isSafe)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    count(parse(input), (numbers) =>
        numbers.some((__, index) => {
            const numbersWithoutIndex = [
                ...numbers.slice(0, index),
                ...numbers.slice(index + 1),
            ]

            return isSafe(numbersWithoutIndex)
        }),
    )
