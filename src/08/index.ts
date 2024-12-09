import * as U from "@/utils"

const parse = (
    input: string,
): { antennas: Record<string, Set<string>>; grid: string[][] } => {
    const grid = U.grid(input)
    const positions = U.map2D(grid, U.index)

    return {
        antennas: Object.fromEntries(
            Object.entries(
                Object.groupBy(
                    positions
                        .flat()
                        .filter(
                            (position) =>
                                U.cell(grid, position) !== "." &&
                                U.cell(grid, position) !== "#",
                        )
                        .map(getHash),
                    (hash) => U.guard(U.cell(grid, getPosition(hash))),
                ),
            ).map(([key, value]) => [key, new Set(value)]),
        ),
        grid,
    }
}

const getHash = ({ c, r }: Record<"c" | "r", number>): string => `${r}_${c}`

const getPosition = (hash: string): Record<"c" | "r", number> => ({
    c: Number(U.at(-1, hash.split("_"))),
    r: Number(U.at(0, hash.split("_"))),
})

const getLeftAntiNodes = (
    left: Record<"c" | "r", number>,
    right: Record<"c" | "r", number>,
    grid: string[][],
): Record<"c" | "r", number>[] => {
    const rowTransition = right.r - left.r
    const colTransition = right.c - left.c

    const nextLeft = {
        c: left.c - colTransition,
        r: left.r - rowTransition,
    }

    if (!U._(U.cell(grid, nextLeft))) return []

    return [nextLeft, ...getLeftAntiNodes(nextLeft, left, grid)]
}

const getRightAntiNodes = (
    left: Record<"c" | "r", number>,
    right: Record<"c" | "r", number>,
    grid: string[][],
): Record<"c" | "r", number>[] => {
    const rowTransition = right.r - left.r
    const colTransition = right.c - left.c

    const nextRight = {
        c: right.c + colTransition,
        r: right.r + rowTransition,
    }

    if (!U._(U.cell(grid, nextRight))) return []

    return [nextRight, ...getRightAntiNodes(right, nextRight, grid)]
}

const solve = (
    antennas: Record<string, Set<string>>,
    getAntiNodes: (
        left: Record<"c" | "r", number>,
        right: Record<"c" | "r", number>,
    ) => Record<"c" | "r", number>[],
): number =>
    U.unique(
        Object.values(antennas).flatMap((antennas) =>
            [...antennas]
                .map(getPosition)
                .flatMap((position, index, positions) =>
                    U.subset(index + 1, positions.length, positions).flatMap(
                        U.λ(getAntiNodes, position),
                    ),
                ),
        ),
        getHash,
    ).length

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const { antennas, grid } = parse(input)

    return solve(antennas, (left, right) =>
        [getLeftAntiNodes, getRightAntiNodes].flatMap((getAntiNode) =>
            U.subset(0, 1, getAntiNode(left, right, grid)),
        ),
    )
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const { antennas, grid } = parse(input)

    return solve(
        antennas,
        (
            left: Record<"c" | "r", number>,
            right: Record<"c" | "r", number>,
        ): Record<"c" | "r", number>[] => [
            ...getLeftAntiNodes(left, right, grid),
            left,
            right,
            ...getRightAntiNodes(left, right, grid),
        ],
    )
}
