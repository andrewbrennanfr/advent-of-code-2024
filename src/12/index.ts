import * as U from "@/utils"

const getPositionHash = (position: U.Position): string =>
    `${position.r}_${position.c}`

const getPosition = (hash: string): U.Position => ({
    c: Number(U.at(hash.split("_"), -1)),
    r: Number(U.at(hash.split("_"), 0)),
})

const getRegion = (
    grid: U.Grid<string>,
    position: U.Position,
    visited: Set<string> = new Set(),
): string[] => {
    const positionHash = getPositionHash(position)

    if (visited.has(positionHash)) return []

    visited.add(positionHash) // eslint-disable-line functional/no-expression-statements, no-restricted-syntax

    const { east, north, south, west } = U.square(position)

    return [
        positionHash,
        ...[east, north, south, west]
            .filter(
                (sibling) => U.cell(grid, sibling) === U.cell(grid, position),
            )
            .flatMap((sibling) => getRegion(grid, sibling, visited)),
    ]
}

const getRegions = (
    grid: U.Grid<string>,
    regions: Record<string, string[]> = {},
    unvisited: Set<string> = getUnvisited(grid),
): Record<string, string[]> => {
    if (unvisited.size === 0) return regions

    const visitedArray = [...unvisited]
    const next = U.at(visitedArray, 0)
    const region = getRegion(grid, getPosition(next))

    return getRegions(
        grid,
        { ...regions, [next]: region },
        new Set(visitedArray.filter((hash) => !region.includes(hash))),
    )
}

const getUnvisited = (grid: U.Grid<string>): Set<string> =>
    new Set(
        U.map2D(grid, (_, index) => index)
            .flat()
            .map(getPositionHash),
    )

const evaluateRegions = (
    grid: U.Grid<string>,
    regions: Record<string, string[]>,
): number => {
    const groups = Object.values(regions)

    const totals = groups.map((group) => {
        const edges = group.flatMap((positionHash) => {
            const position = getPosition(positionHash)

            const { east, north, south, west } = U.square(position)

            return [east, north, south, west].filter(
                (sibling) => U.cell(grid, sibling) !== U.cell(grid, position),
            )
        })

        return group.length * edges.length
    })

    return U.sum(totals)
}

const corner = (
    cell: string,
    {
        edges: { left, right },
        target,
    }: {
        edges: Record<"left" | "right", string | undefined>
        target: string | undefined
    },
): boolean =>
    (left !== cell && right !== cell) ||
    (target !== cell && left === cell && right === cell)

const getCornerCount = (grid: U.Grid<string>, positionHash: string): number => {
    const getCell = (position: U.Position): string | undefined =>
        U.cell(grid, position)

    const position = getPosition(positionHash)
    const cell = getCell(position)

    if (
        Object.values(U.square(position)).every(
            (surroundingPosition) => getCell(surroundingPosition) === cell,
        )
    )
        return 0

    const { northEast, northWest, southEast, southWest } = U.square(position)
    const { east, north, south, west } = U.square(position)

    return [
        {
            edges: { left: getCell(east), right: getCell(north) },
            target: getCell(northEast),
        },
        {
            edges: { left: getCell(west), right: getCell(north) },
            target: getCell(northWest),
        },
        {
            edges: { left: getCell(east), right: getCell(south) },
            target: getCell(southEast),
        },
        {
            edges: { left: getCell(west), right: getCell(south) },
            target: getCell(southWest),
        },
    ].filter(({ edges, target }) => corner(U.guard(cell), { edges, target }))
        .length
}

const evaluateDiscountedRegions = (
    grid: U.Grid<string>,
    regions: Record<string, string[]>,
): number =>
    U.sum(
        Object.values(regions).map(
            (group) =>
                group.length *
                U.sum(group.map((hash) => getCornerCount(grid, hash))),
        ),
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const grid = U.grid(input)

    return evaluateRegions(grid, getRegions(grid))
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const grid = U.grid(input)

    return evaluateDiscountedRegions(grid, getRegions(grid))
}
