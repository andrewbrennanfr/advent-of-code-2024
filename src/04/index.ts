import * as U from "@/utils"

const solve = (
    grid: string[][],
    evaluate: (
        cell: string,
        position: Record<"c" | "r", number>,
        grid: string[][],
    ) => number,
    degrees = 0,
): number =>
    degrees === 360 ? 0 : (
        U.sum(U.map2D(grid, evaluate).flat()) +
        solve(U.clockwise(grid, degrees + 90), evaluate, degrees + 90)
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number =>
    solve(U.grid(input), (cell, position, grid) =>
        cell === "X" ?
            U.count(
                [U.east, U.southEast],
                (direction) =>
                    U.string(
                        U.path(position, direction, 3)
                            .map(U.λ(U.cell, grid))
                            .filter(U._),
                    ) === "XMAS",
            )
        :   0,
    )

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(U.grid(input), (cell, position, grid) =>
        cell === "A" ?
            Number(
                [
                    U.path(U.northWest(position), U.southEast, 2),
                    U.path(U.southWest(position), U.northEast, 2),
                ].every(
                    (positions) =>
                        U.string(
                            positions.map(U.λ(U.cell, grid)).filter(U._),
                        ) === "MAS",
                ),
            )
        :   0,
    )
