import * as U from "@/utils"

const solve = (input: string, predicate: (before: string) => boolean): number =>
    U.sum(
        U.match(input, /mul\((?<left>\d+),(?<right>\d+)\)/gu)
            .filter((mul) => predicate(input.slice(0, mul.index)))
            .map(({ groups }) => Object.values(groups).map(Number))
            .map(U.product),
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => solve(input, U._)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(
        input,
        (before) => before.lastIndexOf("do()") >= before.lastIndexOf("don't()"),
    )
