import * as U from "@/utils"

const parse = (input: string): number[][] =>
    U.map2D(U.grid(input, /: | /u), Number)

const solve = (
    equations: number[][],
    ...operators: ((left: number, right: number) => number)[]
): number =>
    U.sum(
        equations
            .filter((equation) =>
                U.isIncluded(
                    U.produce(U.without(equation, 0), (left, right) =>
                        operators
                            .map(U.λ(U._(U.apply), [left, right]))
                            .filter((result) => result <= U.at(equation, 0)),
                    ),
                    U.at(equation, 0),
                ),
            )
            .map((value) => U.at(value, 0)),
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number =>
    solve(parse(input), U.add, U.multiply)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(parse(input), U.add, U.multiply, (left, right) =>
        Number(`${left}${right}`),
    )
