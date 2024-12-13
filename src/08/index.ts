import { at, unique } from "@/array"
import {
    atPosition,
    type Grid,
    makeGrid,
    mapGrid,
    type Position,
    unsafeAtPosition,
} from "@/grid"
import { isDefined } from "@/utils"

const getHash = ({ c, r }: Position): string => `${r}_${c}`

const getPosition = (hash: string): Position => ({
    c: Number(at(hash.split("_"), -1)),
    r: Number(at(hash.split("_"), 0)),
})

const parse = (
    input: string,
): { antennas: Record<string, Set<string>>; grid: Grid<string> } => {
    const grid = makeGrid(input)
    const positions = mapGrid(grid, (__, index) => index)

    return {
        antennas: Object.fromEntries(
            Object.entries(
                Object.groupBy(
                    positions
                        .flat()
                        .filter(
                            (position) =>
                                atPosition(grid, position) !== "." &&
                                atPosition(grid, position) !== "#",
                        )
                        .map(getHash),
                    (hash) => atPosition(grid, getPosition(hash)),
                ),
            ).map(([key, value]) => [key, new Set(value)]),
        ),
        grid,
    }
}

const getLeftAntiNodes = (
    left: Position,
    right: Position,
    grid: Grid<string>,
): Position[] => {
    const nextLeft = {
        c: left.c - (right.c - left.c),
        r: left.r - (right.r - left.r),
    }

    return isDefined(unsafeAtPosition(grid, nextLeft)) ?
            [nextLeft, ...getLeftAntiNodes(nextLeft, left, grid)]
        :   []
}

const getRightAntiNodes = (
    left: Position,
    right: Position,
    grid: Grid<string>,
): Position[] => {
    const nextRight = {
        c: right.c + (right.c - left.c),
        r: right.r + (right.r - left.r),
    }

    return isDefined(unsafeAtPosition(grid, nextRight)) ?
            [nextRight, ...getRightAntiNodes(right, nextRight, grid)]
        :   []
}

const solve = (
    antennas: Record<string, Set<string>>,
    getAntiNodes: (left: Position, right: Position) => Position[],
): number =>
    unique(
        Object.values(antennas).flatMap((antennaSet) =>
            [...antennaSet]
                .map(getPosition)
                .flatMap((position, index, positions) =>
                    positions
                        .slice(index + 1)
                        .flatMap((_position) =>
                            getAntiNodes(position, _position),
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
