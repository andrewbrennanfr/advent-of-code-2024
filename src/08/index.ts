import * as U from "@/utils"

const parse = (
    input: string,
): { antennas: Record<string, Set<string>>; grid: U.Grid<string> } => {
    const grid = U.grid(input)
    const positions = U.map2D(grid, (_, index) => index)

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
                        .map(({ c, r }) => U.hash(r, c)),
                    (hash) => U.guard(U.cell(grid, getPosition(hash))),
                ),
            ).map(([key, value]) => [key, new Set(value)]),
        ),
        grid,
    }
}

const getPosition = (hash: string): U.Position => ({
    c: Number(U.at(U.unhash(hash), -1)),
    r: Number(U.at(U.unhash(hash), 0)),
})

const getLeftAntiNodes = (
    left: U.Position,
    right: U.Position,
    grid: U.Grid<string>,
): U.Position[] => {
    const nextLeft = {
        c: left.c - (right.c - left.c),
        r: left.r - (right.r - left.r),
    }

    return U.defined(U.cell(grid, nextLeft)) ?
            [nextLeft, ...getLeftAntiNodes(nextLeft, left, grid)]
        :   []
}

const getRightAntiNodes = (
    left: U.Position,
    right: U.Position,
    grid: U.Grid<string>,
): U.Position[] => {
    const nextRight = {
        c: right.c + (right.c - left.c),
        r: right.r + (right.r - left.r),
    }

    return U.defined(U.cell(grid, nextRight)) ?
            [nextRight, ...getRightAntiNodes(right, nextRight, grid)]
        :   []
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
                    positions
                        .slice(index + 1)
                        .flatMap((_position) =>
                            getAntiNodes(position, _position),
                        ),
                ),
        ),
        ({ c, r }) => U.hash(r, c),
    ).length

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const { antennas, grid } = parse(input)

    return solve(antennas, (left, right) =>
        [getLeftAntiNodes, getRightAntiNodes].flatMap((getAntiNode) =>
            getAntiNode(left, right, grid).slice(0, 1),
        ),
    )
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const { antennas, grid } = parse(input)

    return solve(antennas, (left, right) => [
        ...getLeftAntiNodes(left, right, grid),
        left,
        right,
        ...getRightAntiNodes(left, right, grid),
    ])
}
