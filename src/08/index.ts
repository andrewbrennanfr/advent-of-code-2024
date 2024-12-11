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

const getHash = ({ c, r }: U.Position): string => `${r}_${c}`

const getPosition = (hash: string): U.Position => ({
    c: Number(U.last(hash.split("_"))),
    r: Number(U.first(hash.split("_"))),
})

const getLeftAntiNodes = (
    left: U.Position,
    right: U.Position,
    grid: string[][],
): U.Position[] => {
    const rowTransition = right.r - left.r
    const colTransition = right.c - left.c

    const nextLeft = {
        c: left.c - colTransition,
        r: left.r - rowTransition,
    }

    if (!U.isDefined(U.cell(grid, nextLeft))) return []

    return [nextLeft, ...getLeftAntiNodes(nextLeft, left, grid)]
}

const getRightAntiNodes = (
    left: U.Position,
    right: U.Position,
    grid: string[][],
): U.Position[] => {
    const rowTransition = right.r - left.r
    const colTransition = right.c - left.c

    const nextRight = {
        c: right.c + colTransition,
        r: right.r + rowTransition,
    }

    if (!U.isDefined(U.cell(grid, nextRight))) return []

    return [nextRight, ...getRightAntiNodes(right, nextRight, grid)]
}

const solve = (
    antennas: Record<string, Set<string>>,
    getAntiNodes: (left: U.Position, right: U.Position) => U.Position[],
): number =>
    U.unique(
        Object.values(antennas).flatMap((antennas) =>
            [...antennas]
                .map(getPosition)
                .flatMap((position, index, positions) =>
                    U.subset(positions, index + 1, positions.length).flatMap(
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
            U.subset(getAntiNode(left, right, grid), 0, 1),
        ),
    )
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const { antennas, grid } = parse(input)

    return solve(
        antennas,
        (left: U.Position, right: U.Position): U.Position[] => [
            ...getLeftAntiNodes(left, right, grid),
            left,
            right,
            ...getRightAntiNodes(left, right, grid),
        ],
    )
}
