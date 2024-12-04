import * as U from "@/utils"

const solve = (
    grid: string[][],
    evaluate: (
        cell: string,
        position: Record<"c" | "r", number>,
        grid: string[][],
    ) => number,
): number =>
    U.sum(
        [0, 90, 180, 270]
            .flatMap((degrees) => U.map2d(U.clockwise(grid, degrees), evaluate))
            .flat(),
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number =>
    solve(U.grid(input), (cell, position, grid) =>
        cell === "X" ?
            U.count(
                [
                    U.path([position], U.east, 3),
                    U.path([position], U.southEast, 3),
                ],
                (positions) =>
                    positions.map(U.λ(U.cell, grid)).join("") === "XMAS",
            )
        :   0,
    )

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(U.grid(input), (cell, position, grid) =>
        cell === "A" ?
            Number(
                [
                    U.path([U.northWest(position)], U.southEast, 2),
                    U.path([U.southWest(position)], U.northEast, 2),
                ].every(
                    (positions) =>
                        positions.map(U.λ(U.cell, grid)).join("") === "MAS",
                ),
            )
        :   0,
    )
