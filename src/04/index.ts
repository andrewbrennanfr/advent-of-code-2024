import * as U from "@/utils"

const solve = (
    grid: string[][],
    evaluate: (
        cell: string,
        { c, r }: { c: number; r: number },
        grid: string[][],
    ) => number,
    degrees = 0,
): number =>
    U.sum(U.map2d(grid, evaluate).flat()) +
    (degrees + 90 === 360 ?
        0
    :   solve(U.clockwise(grid), evaluate, degrees + 90))

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number =>
    solve(U.grid(input), (cell, { c, r }, grid) => {
        if (cell !== "X") return 0

        const { e: east1 } = U.siblings({ c, r })
        const { e: east2 } = U.siblings(east1)
        const { e: east3 } = U.siblings(east2)

        const { se: southEast1 } = U.siblings({ c, r })
        const { se: southEast2 } = U.siblings(southEast1)
        const { se: southEast3 } = U.siblings(southEast2)

        return U.count(
            [
                [
                    cell,
                    U.cell(grid, east1),
                    U.cell(grid, east2),
                    U.cell(grid, east3),
                ],
                [
                    cell,
                    U.cell(grid, southEast1),
                    U.cell(grid, southEast2),
                    U.cell(grid, southEast3),
                ],
            ],
            (characters) => characters.join("") === "XMAS",
        )
    })

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(U.grid(input), (cell, { c, r }, grid) => {
        if (cell !== "A") return 0

        const { ne, nw, se, sw } = U.siblings({ c, r })

        return Number(
            [
                [U.cell(grid, nw), cell, U.cell(grid, se)],
                [U.cell(grid, sw), cell, U.cell(grid, ne)],
            ].every((characters) => characters.join("") === "MAS"),
        )
    })
