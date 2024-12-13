import { at } from "@/array"
import {
    atPosition,
    type Grid,
    makeGrid,
    mapGrid,
    type Position,
    square,
    unsafeAtPosition,
} from "@/grid"
import { mutateSet } from "@/mutation"
import { sum } from "@/number"
import { hash } from "@/utils"

const parse = (input: string): Grid<string> => makeGrid(input)

const getPosition = (hashString: string): Position => {
    const unhashed = hashString.split("_")
    const c = Number(at(unhashed, -1))
    const r = Number(at(unhashed, 0))

    return { c, r }
}

const getRegion = (
    grid: Grid<string>,
    position: Position,
    visited: Set<string> = new Set(),
): string[] => {
    const positionHash = hash(position.r, position.c)

    if (visited.has(positionHash)) return []

    const cell = atPosition(grid, position)

    const { east, north, south, west } = square(position)
    const inRegion = [east, north, south, west].filter(
        (sibling) => unsafeAtPosition(grid, sibling) === cell,
    )

    const nextVisited = mutateSet(visited, [positionHash])

    return [
        positionHash,
        ...inRegion.flatMap((sibling) => getRegion(grid, sibling, nextVisited)),
    ]
}

const getUnvisited = (grid: Grid<string>): Set<string> => {
    const gridIndexes = mapGrid(grid, (__, index) => index)
    const positions = gridIndexes.flat()
    const positionHashes = positions.map(({ c, r }) => hash(r, c))

    return new Set(positionHashes)
}

const getRegions = (
    grid: Grid<string>,
    regions: Record<string, string[]> = {},
    unvisited: Set<string> = getUnvisited(grid),
): Record<string, string[]> => {
    if (unvisited.size === 0) return regions

    const unvisitedArray = [...unvisited]

    const next = at(unvisitedArray, 0)
    const nextPosition = getPosition(next)

    const region = getRegion(grid, nextPosition)
    const nextRegions = { ...regions, [next]: region }

    const nextUnvisited = new Set(
        unvisitedArray.filter((hashString) => !region.includes(hashString)),
    )

    return getRegions(grid, nextRegions, nextUnvisited)
}

const evaluateRegions = (
    grid: Grid<string>,
    regions: Record<string, string[]>,
): number => {
    const groups = Object.values(regions)

    const totals = groups.map((group) => {
        const edges = group.flatMap((positionHash) => {
            const position = getPosition(positionHash)
            const cell = atPosition(grid, position)

            const { east, north, south, west } = square(position)

            return [east, north, south, west].filter(
                (sibling) => unsafeAtPosition(grid, sibling) !== cell,
            )
        })

        return group.length * edges.length
    })

    return sum(totals)
}

const isCorner = (
    cell: string,
    { left, right }: Record<"left" | "right", string | undefined>,
    target: string | undefined,
): boolean =>
    (left !== cell && right !== cell) ||
    (target !== cell && left === cell && right === cell)

const getCornerCount = (grid: Grid<string>, positionHash: string): number => {
    const position = getPosition(positionHash)
    const cell = atPosition(grid, position)

    const surrounding = square(position)
    const isInternal = Object.values(surrounding).every(
        (surroundingPosition) =>
            unsafeAtPosition(grid, surroundingPosition) === cell,
    )

    if (isInternal) return 0

    const {
        east,
        north,
        northEast,
        northWest,
        south,
        southEast,
        southWest,
        west,
    } = surrounding

    return [
        {
            left: unsafeAtPosition(grid, east),
            right: unsafeAtPosition(grid, north),
            target: unsafeAtPosition(grid, northEast),
        },
        {
            left: unsafeAtPosition(grid, west),
            right: unsafeAtPosition(grid, north),
            target: unsafeAtPosition(grid, northWest),
        },
        {
            left: unsafeAtPosition(grid, east),
            right: unsafeAtPosition(grid, south),
            target: unsafeAtPosition(grid, southEast),
        },
        {
            left: unsafeAtPosition(grid, west),
            right: unsafeAtPosition(grid, south),
            target: unsafeAtPosition(grid, southWest),
        },
    ].filter(({ left, right, target }) =>
        isCorner(cell, { left, right }, target),
    ).length
}

const evaluateDiscountedRegions = (
    grid: Grid<string>,
    regions: Record<string, string[]>,
): number => {
    const regionList = Object.values(regions)
    const regionCosts = regionList.map((region) => {
        const sideCount = sum(
            region.map((positionHash) => getCornerCount(grid, positionHash)),
        )

        return region.length * sideCount
    })

    return sum(regionCosts)
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
