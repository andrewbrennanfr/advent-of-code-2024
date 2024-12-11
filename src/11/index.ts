import * as U from "@/utils"

const parse = (input: string): number[] => input.trim().split(" ").map(Number)

const evaluate = (number: number): number[] => {
    const string = String(number)

    if (number === 0) return [1]

    if (U.isEven(string.length)) {
        const split = U.slices(string, string.length / 2)
        const left = Number(U.at(split, 0))
        const right = Number(U.at(split, 1))

        return [left, right]
    }

    return [number * 2024]
}

const solve = U.$((numbers: number[], times: number): number => {
    if (times === 0) return 1

    if (numbers.length === 1)
        return U.sum(
            evaluate(U.at(numbers, 0)).map((number) =>
                solve([number], times - 1),
            ),
        )

    return U.sum(numbers.map((number) => solve([number], times)))
})

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => solve(parse(input), 25)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => solve(parse(input), 75)
