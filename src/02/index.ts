import * as U from "@/utils"

const parse = (input: string): number[][] =>
    U.lines(input).map((line) => U.spaces(line).map(Number))

const safe = (numbers: number[]): boolean =>
    (U.ascending(numbers) || U.descending(numbers)) &&
    U.follows(numbers, (left, right) =>
        U.between(1, U.distance(left, right), 3),
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (
    input: string,
    predicate: (numbers: number[]) => boolean = safe,
): number => U.count(parse(input), predicate)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    part01(input, (numbers) =>
        numbers.some((__, index) => safe(U.without(numbers, index))),
    )
