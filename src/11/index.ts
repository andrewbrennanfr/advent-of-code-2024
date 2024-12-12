import * as U from "@/utils"

const parse = (input: string): number[] =>
    U.at(U.grid(input, " "), 0).map(Number)

const evaluate = (number: number): number[] => {
    const string = String(number)

    if (number === 0) return [1]

    if (U.even(string.length))
        return [
            Number(string.slice(0, string.length / 2)),
            Number(string.slice(string.length / 2)),
        ]

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
