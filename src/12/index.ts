import * as U from "@/utils"

const parse = (input: string): string[][] => U.grid(input, "")

const getPositionHash = (position: U.Position): string =>
    U.join([U.r(position), U.c(position)], "_")

const getPosition = (hash: string): U.Position => ({
    c: U.int(U.last(U.split(hash, "_"))),
    r: U.int(U.first(U.split(hash, "_"))),
})

const getRegion = (
    grid: string[][],
    position: U.Position,
    visited: Set<string> = new Set(),
): string[] => {
    const positionHash = getPositionHash(position)

    if (visited.has(positionHash)) return []

    visited.add(positionHash) // eslint-disable-line functional/no-expression-statements, no-restricted-syntax

    const cell = U.guard(U.cell(grid, position))
    const siblings = U.values(U.siblings(position))
    const matchingSiblings = U.filter(siblings, (position) =>
        U.isEqual(U.cell(grid, position), cell),
    )

    return [
        positionHash,
        ...U.flatMap(matchingSiblings, (matchingSibling) =>
            getRegion(grid, matchingSibling, visited),
        ),
    ]
}

const getRegions = (
    grid: string[][],
    regions: Record<string, string[]> = {},
    unvisited: Set<string> = getUnvisited(grid),
): Record<string, string[]> => {
    if (U.isZero(unvisited.size)) return regions

    const visitedArray = [...unvisited]
    const next = U.first(visitedArray)
    const position = getPosition(next)

    const region = getRegion(grid, position)
    const nextRegions = { ...regions, [next]: region }
    const nextUnvisited = new Set(
        U.filter(visitedArray, U.λ(U.isNot(U.isIncluded), region)),
    )

    return getRegions(grid, nextRegions, nextUnvisited)
}

const getUnvisited = (grid: string[][]): Set<string> =>
    new Set(U.map(U.flat(U.map2D(grid, U.index)), getPositionHash))

const evaluateRegions = (
    grid: string[][],
    regions: Record<string, string[]>,
): number => {
    const groups = U.values(regions)

    const totals = U.map(groups, (group) => {
        const edges = U.flatMap(group, (positionHash) => {
            const position = getPosition(positionHash)
            const siblings = U.values(U.siblings(position))
            const cell = U.cell(grid, position)

            return U.filter(siblings, (siblingPosition) =>
                U.isNot(U.isEqual)(U.cell(grid, siblingPosition), cell),
            )
        })

        return U.multiply(U.length(group), U.length(edges))
    })

    return U.sum(totals)
}

const isCorner = (
    cell: string,
    {
        edges: { left, right },
        target,
    }: {
        edges: Record<"left" | "right", string | undefined>
        target: string | undefined
    },
): boolean =>
    (U.isNot(U.isEqual)(left, cell) && U.isNot(U.isEqual)(right, cell)) ||
    (U.isNot(U.isEqual)(target, cell) &&
        U.isEqual(left, cell) &&
        U.isEqual(right, cell))

const getCornerCount = (grid: string[][], positionHash: string): number => {
    const getCell = (position: U.Position): string | undefined =>
        U.cell(grid, position)

    const position = getPosition(positionHash)
    const surrounding = U.values(U.surrounding(position))
    const cell = U.guard(U.cell(grid, position))

    if (U.every(U.map(surrounding, U.λ(U.cell, grid)), U.λ(U.isEqual, cell)))
        return 0

    const { northEast, northWest, southEast, southWest } = U.cousins(position)
    const { east, north, south, west } = U.siblings(position)

    const corners = U.filter(
        [
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
        ],
        U.λ(isCorner, cell),
    )

    return U.length(corners)
}

const evaluateDiscountedRegions = (
    grid: string[][],
    regions: Record<string, string[]>,
): number => {
    const groups = U.values(regions)

    const totals = U.map(groups, (group) => {
        const cornerCount = U.map(group, U.λ(getCornerCount, grid))

        return U.multiply(U.length(group), U.sum(cornerCount))
    })

    return U.sum(totals)
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const grid = parse(input)

    return evaluateRegions(grid, getRegions(grid))
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const grid = parse(input)

    return evaluateDiscountedRegions(grid, getRegions(grid))
}
