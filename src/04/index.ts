import * as U from "@/utils"

const solve = (
    grid: U.Grid<string>,
    evaluate: (
        cell: string,
        position: U.Position,
        grid: U.Grid<string>,
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
                    U.path2D(position, direction, 3)
                        .map((position) => U.cell(grid, position))
                        .join("") === "XMAS",
            )
        :   0,
    )

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(U.grid(input), (cell, position, grid) =>
        cell === "A" ?
            Number(
                [
                    U.path2D(U.northWest(position), U.southEast, 2),
                    U.path2D(U.southWest(position), U.northEast, 2),
                ].every(
                    (positions) =>
                        positions
                            .map((position) => U.cell(grid, position))
                            .join("") === "MAS",
                ),
            )
        :   0,
    )
