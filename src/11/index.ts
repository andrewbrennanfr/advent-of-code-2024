import { at } from "@/array"
import { makeGrid } from "@/grid"
import { isEven, sum } from "@/number"
import { memo } from "@/utils"

const parse = (input: string): number[] => {
    const grid = makeGrid(input, " ")

    return at(grid, 0).map(Number)
}

const evaluate = (number: number): number[] => {
    if (number === 0) return [1]

    const string = String(number)

    if (isEven(string.length)) {
        const firstHalf = string.slice(0, string.length / 2)
        const secondHalf = string.slice(string.length / 2)

        return [Number(firstHalf), Number(secondHalf)]
    }

    return [number * 2024]
}

const solve = memo((numbers: number[], times: number): number => {
    if (times === 0) return 1

    if (numbers.length === 1) {
        const number = at(numbers, 0)
        const evaluatedNumbers = evaluate(number)
        const solvedNumbers = evaluatedNumbers.map((evaluatedNumber) =>
            solve([evaluatedNumber], times - 1),
        )

        return sum(solvedNumbers)
    }

    const solvedNumbers = numbers.map((number) => solve([number], times))

    return sum(solvedNumbers)
})

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => solve(parse(input), 25)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => solve(parse(input), 75)
