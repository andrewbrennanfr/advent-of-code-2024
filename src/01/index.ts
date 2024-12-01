import * as U from "@/utils"

const parse = (input: string): number[][] =>
    U.clockwise(U.lines(input).map((line) => U.spaces(line).map(Number))).map(
        (numbers) => U.sort(numbers),
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (
    input: string,
    combine: (left: number[], right: number[], index: number) => number = (
        left,
        right,
        index,
    ) => U.distance(U.at(left, index), U.at(right, index)),
): number => U.sum(U.converge(parse(input), combine))

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    part01(
        input,
        (left, right, index) =>
            U.at(left, index) *
            U.count(right, (number) => number === U.at(left, index)),
    )
