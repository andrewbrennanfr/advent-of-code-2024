import * as U from "@/utils"

const parse = (
    input: string,
): Record<"ax" | "ay" | "bx" | "by" | "px" | "py", number>[] =>
    input
        .trim()
        .split("\n\n")
        .map((chunk) =>
            U.at(
                U.match(
                    chunk,
                    /^Button A: X\+(?<ax>[0-9]+), Y\+(?<ay>[0-9]+)\nButton B: X\+(?<bx>[0-9]+), Y\+(?<by>[0-9]+)\nPrize: X=(?<px>[0-9]+), Y=(?<py>[0-9]+)$/gu,
                ),
                0,
            ),
        )
        .map(({ groups }) => ({
            ax: Number(groups["ax"]),
            ay: Number(groups["ay"]),
            bx: Number(groups["bx"]),
            by: Number(groups["by"]),
            px: Number(groups["px"]),
            py: Number(groups["py"]),
        }))

const calculateMoves = ({
    ax,
    ay,
    bx,
    by,
    px,
    py,
}: Record<"ax" | "ay" | "bx" | "by" | "px" | "py", number>): Record<
    "aCount" | "bCount",
    number
> => {
    const nextAx = ax * by
    const nextPx = px * by

    const nextAy = ay * bx
    const nextPy = py * bx

    const aCount = (nextPx - nextPy) / (nextAx - nextAy)
    const bCount = (px - aCount * ax) / bx

    return { aCount, bCount }
}

export const evaluate = ({
    aCount,
    bCount,
}: Record<"aCount" | "bCount", number>): number => aCount * 3 + bCount

export const winner = ({
    aCount,
    bCount,
}: Record<"aCount" | "bCount", number>): boolean =>
    Math.floor(aCount) === aCount && Math.floor(bCount) === bCount

const solve = (
    games: Record<"ax" | "ay" | "bx" | "by" | "px" | "py", number>[],
): number => U.sum(games.map(calculateMoves).filter(winner).map(evaluate))

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => solve(parse(input))

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(
        parse(input).map((game) => ({
            ...game,
            px: game.px + 10_000_000_000_000,
            py: game.py + 10_000_000_000_000,
        })),
    )
