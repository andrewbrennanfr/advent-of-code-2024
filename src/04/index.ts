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
            .map(U.λ(U.clockwise, grid))
            .flatMap((grid) => U.map2D(grid, evaluate))
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
                    U.string(positions.map(U.λ(U.cell, grid)).filter(U._)) ===
                    "XMAS",
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
                        U.string(
                            positions.map(U.λ(U.cell, grid)).filter(U._),
                        ) === "MAS",
                ),
            )
        :   0,
    )
