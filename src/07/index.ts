import * as U from "@/utils"

const parse = (input: string): U.Grid<number> =>
    U.map2D(U.grid(input, /: | /u), Number)

const solve = (
    equations: U.Grid<number>,
    ...operators: ((left: number, right: number) => number)[]
): number =>
    U.sum(
        equations
            .filter((equation) =>
                equation
                    .slice(1)
                    .reduce<number[]>(
                        (left, right) =>
                            left.length === 0 ?
                                [right]
                            :   left.flatMap((value) =>
                                    operators
                                        .map((operator) =>
                                            operator(value, right),
                                        )
                                        .filter(
                                            (result) =>
                                                result <= U.at(equation, 0),
                                        ),
                                ),
                        [],
                    )
                    .includes(U.at(equation, 0)),
            )
            .map((value) => U.at(value, 0)),
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number =>
    solve(
        parse(input),
        (left, right) => left + right,
        (left, right) => left * right,
    )

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(
        parse(input),
        (left, right) => left + right,
        (left, right) => left * right,
        (left, right) => Number(`${left}${right}`),
    )
