import { at } from "@/array"
import {
    atPosition,
    east,
    type Grid,
    makeGrid,
    mapGrid,
    north,
    type Position,
    south,
    square,
    unsafeAtPosition,
    west,
} from "@/grid"
import { mutateGrid, mutateSet } from "@/mutation"
import { always, makeHash, panic, safe } from "@/utils"

const parse = (
    input: string,
): {
    current: { facing: (position: Position) => Position; position: Position }
    end: Position
    grid: Grid<string>
    start: Position
} => {
    const grid = makeGrid(input)

    const start = { c: 1, r: grid.length - 2 }
    const end = { c: at(grid, 0).length - 2, r: 1 }
    const current = { facing: east, position: start }

    return { current, end, grid, start }
}

const getSurrounding = (grid: Grid<string>, position: Position): Position[] => {
    const surrounding = square(position)

    return [
        surrounding.north,
        surrounding.east,
        surrounding.south,
        surrounding.west,
    ].filter(
        ({ c, r }) =>
            unsafeAtPosition(grid, { c, r }) === "." ||
            unsafeAtPosition(grid, { c, r }) === "E" ||
            unsafeAtPosition(grid, { c, r }) === "S",
    )
}

const traverse = (
    grid: Grid<string>,
    lastQueue: {
        cost: number
        facing: (position: Position) => Position
        position: Position
    }[],
    costs: Grid<Record<string, number>>,
    visited: Set<string>,
): {
    costs: Grid<Record<string, number>>
    // eslint-disable-next-line @typescript-eslint/max-params
} => {
    if (lastQueue.length === 0) return { costs }

    const current = at(lastQueue, 0)
    const queue = lastQueue.slice(1)

    const currentFacing =
        current.facing === north ? "north"
        : current.facing === east ? "east"
        : current.facing === south ? "south"
        : current.facing === west ? "west"
        : panic("Not facing anywhere!")
    const currentHash = makeHash(
        current.position.r,
        current.position.c,
        currentFacing,
    )

    if (visited.has(currentHash)) return traverse(grid, queue, costs, visited)

    const nextVisited = mutateSet(visited, [currentHash])
    const nextCosts =
        (
            safe(atPosition(costs, current.position)[currentFacing]) >
            current.cost
        ) ?
            mutateGrid(costs, [
                [
                    current.position,
                    {
                        ...atPosition(costs, current.position),
                        [currentFacing]: current.cost,
                    },
                ],
            ])
        :   costs

    const getCosts1 =
        current.facing === north ? north
        : current.facing === east ? east
        : current.facing === south ? south
        : current.facing === west ? west
        : panic("Not facing anywhere!")

    const getCosts1001 =
        current.facing === north || current.facing === south ? [east, west]
        : current.facing === east || current.facing === west ? [north, south]
        : panic("Not facing anywhere!")

    const getCosts2001 =
        current.facing === north ? south
        : current.facing === east ? west
        : current.facing === south ? north
        : current.facing === west ? east
        : panic("Not facing anywhere!")

    const costs1 = getCosts1(current.position)
    const costs1Hash = makeHash(costs1.r, costs1.c)

    const costs1001A = at(getCosts1001, 0)(current.position)
    const costs1001AHash = makeHash(costs1001A.r, costs1001A.c)

    const costs1001B = at(getCosts1001, 1)(current.position)
    const costs1001BHash = makeHash(costs1001B.r, costs1001B.c)

    const costs2001 = getCosts2001(current.position)
    const costs2001Hash = makeHash(costs2001.r, costs2001.c)

    const surrounding = getSurrounding(grid, current.position)

    const costed = surrounding.map((surroundingPosition) => {
        const surroundingPositionHash = makeHash(
            surroundingPosition.r,
            surroundingPosition.c,
        )

        const cost =
            current.cost +
            (surroundingPositionHash === costs1Hash ? 1
            : (
                surroundingPositionHash === costs1001AHash ||
                surroundingPositionHash === costs1001BHash
            ) ?
                1001
            : surroundingPositionHash === costs2001Hash ? 2001
            : panic("No matching hash!"))

        const facing =
            surroundingPositionHash === costs1Hash ? getCosts1
            : surroundingPositionHash === costs1001AHash ? at(getCosts1001, 0)
            : surroundingPositionHash === costs1001BHash ? at(getCosts1001, 1)
            : surroundingPositionHash === costs2001Hash ? getCosts2001
            : panic("No matching hash!")

        return { cost, facing, position: surroundingPosition }
    })

    const nextQueue = [...queue, ...costed]

    return traverse(
        grid,
        nextQueue.toSorted((left, right) =>
            left.cost < right.cost ? -1
            : left.cost > right.cost ? 1
            : 0,
        ),
        nextCosts,
        nextVisited,
    )
}

const findBestPath = (
    costs: Grid<Record<string, number>>,
    start: Position,
    current: Position,
    currentCost: number,
    // eslint-disable-next-line @typescript-eslint/max-params
): string[] => {
    const currentHash = makeHash(current.r, current.c)

    if (current.r === start.r && current.c === start.c) return [currentHash]

    const surrounding = square(current)

    const possiblePreviousSteps = [
        surrounding.north,
        surrounding.east,
        surrounding.south,
        surrounding.west,
    ].filter((surroundingPosition) => {
        const surroundingCosts = Object.values(
            atPosition(costs, surroundingPosition),
        )

        return surroundingCosts.some(
            (surroundingCost) =>
                surroundingCost < currentCost &&
                (surroundingCost === currentCost - 1 ||
                    surroundingCost === currentCost - 1001 ||
                    surroundingCost === currentCost - 2001),
        )
    })

    const possiblePreviousHashes = possiblePreviousSteps.map(({ c, r }) =>
        makeHash(r, c),
    )

    return [
        currentHash,
        ...possiblePreviousHashes,
        ...possiblePreviousSteps.flatMap((surroundingPosition) => {
            const surroundingCosts = Object.values(
                atPosition(costs, surroundingPosition),
            )

            const filteredSurroundingCosts = surroundingCosts.filter(
                (surroundingCost) =>
                    surroundingCost < currentCost &&
                    (surroundingCost === currentCost - 1 ||
                        surroundingCost === currentCost - 1001 ||
                        surroundingCost === currentCost - 2001),
            )

            return filteredSurroundingCosts.flatMap((cost) =>
                findBestPath(costs, start, surroundingPosition, cost),
            )
        }),
    ]
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const data = parse(input)

    const result = traverse(
        data.grid,
        [
            {
                cost: 0,
                facing: data.current.facing,
                position: data.current.position,
            },
        ],
        mapGrid(
            data.grid,
            always({
                east: Infinity,
                north: Infinity,
                south: Infinity,
                west: Infinity,
            }),
        ),
        new Set(),
    )

    return Math.min(...Object.values(atPosition(result.costs, data.end)))
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const data = parse(input)

    const result = traverse(
        data.grid,
        [
            {
                cost: 0,
                facing: data.current.facing,
                position: data.current.position,
            },
        ],
        mapGrid(
            data.grid,
            always({
                east: Infinity,
                north: Infinity,
                south: Infinity,
                west: Infinity,
            }),
        ),
        new Set(),
    )
    const maxCost = Math.min(
        ...Object.values(atPosition(result.costs, data.end)),
    )

    const bestPath = findBestPath(result.costs, data.start, data.end, maxCost)

    return new Set(bestPath).size
}
