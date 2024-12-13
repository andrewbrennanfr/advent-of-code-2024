import { sum } from "@/number"
import { match } from "@/string"

const parse = (
    input: string,
): Record<"ax" | "ay" | "bx" | "by" | "px" | "py", number>[] => {
    const chunks = input.trim().split("\n\n")

    const matches = chunks.map((chunk) =>
        match(
            chunk,
            /^Button A: X\+(?<ax>[0-9]+), Y\+(?<ay>[0-9]+)\nButton B: X\+(?<bx>[0-9]+), Y\+(?<by>[0-9]+)\nPrize: X=(?<px>[0-9]+), Y=(?<py>[0-9]+)$/gu,
        ),
    )

    return matches.map(({ groups }) => ({
        ax: Number(groups["ax"]),
        ay: Number(groups["ay"]),
        bx: Number(groups["bx"]),
        by: Number(groups["by"]),
        px: Number(groups["px"]),
        py: Number(groups["py"]),
    }))
}

const calculate = ({
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

export const evaluate = (
    winners: Record<"aCount" | "bCount", number>[],
): number => sum(winners.map(({ aCount, bCount }) => aCount * 3 + bCount))

export const isWinner = ({
    aCount,
    bCount,
}: Record<"aCount" | "bCount", number>): boolean =>
    Math.floor(aCount) === aCount && Math.floor(bCount) === bCount

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const games = parse(input)
    const moves = games.map(calculate)
    const winners = moves.filter(isWinner)

    return evaluate(winners)
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const games = parse(input)
    const biggerGames = games.map(({ px, py, ...game }) => ({
        ...game,
        px: px + 10_000_000_000_000,
        py: py + 10_000_000_000_000,
    }))
    const moves = biggerGames.map(calculate)
    const winners = moves.filter(isWinner)

    return evaluate(winners)
}
