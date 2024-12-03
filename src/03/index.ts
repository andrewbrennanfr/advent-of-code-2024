import * as U from "@/utils"

/* --------------------------------- part01 --------------------------------- */

export const part01 = (
    input: string,
    predicate: (before: string) => boolean = U._,
): number =>
    U.sum(
        U.match(input, /mul\((?<left>\d+),(?<right>\d+)\)/gu)
            .filter((mul) => predicate(input.slice(0, mul.index)))
            .map(({ groups }) => U.product(Object.values(groups).map(Number))),
    )

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    part01(
        input,
        (before) => before.lastIndexOf("do()") >= before.lastIndexOf("don't()"),
    )
