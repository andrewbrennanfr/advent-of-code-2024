import * as U from "@/utils"

/* --------------------------------- part01 --------------------------------- */

export const part01 = (
    input: string,
    combine: (left: number[], right: number[], index: number) => number = (
        left,
        right,
        index,
    ) => U.distance(U.at(index, left), U.at(index, right)),
): number =>
    U.sum(
        U.converge(
            U.clockwise(U.map2d(U.grid(input, / +/u), Number)).map((numbers) =>
                U.sort(numbers),
            ),
            combine,
        ),
    )

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    part01(
        input,
        (left, right, index) =>
            U.at(index, left) *
            U.count(right, (number) => number === U.at(index, left)),
    )
