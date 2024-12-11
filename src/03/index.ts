import * as U from "@/utils"

const solve = (
    input: string,
    predicate: (before: string) => boolean,
): number => {
    const matches = U.match(input, /mul\((?<left>\d+),(?<right>\d+)\)/gu)
    const filteredMatches = U.filter(matches, (mul) =>
        predicate(U.slice(input, 0, mul.index)),
    )
    const groups = U.map(filteredMatches, U.λ(U._(U.property), "groups"))
    const values = U.map(groups, Object.values)
    const numbers = U.map(values, U.λ(U._(U.map), U.int))
    const products = U.map(numbers, U.product)

    return U.sum(products)
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => solve(input, U.isDefined)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(input, (before) =>
        U.isGreaterEqual(
            U.lastIndexOf(before, "do()"),
            U.lastIndexOf(before, "don't()"),
        ),
    )
