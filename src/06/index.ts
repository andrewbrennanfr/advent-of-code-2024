import { at, count, unique } from "@/array"
import {
    east,
    type Grid,
    makeGrid,
    mapGrid,
    north,
    pathGrid,
    type Position,
    south,
    west,
} from "@/grid"
import { makeHash, safe } from "@/utils"

const parse = (
    input: string,
): {
    grid: Grid<{ cell: string; position: Position }>
    guard: { facing: string; position: Position }
    obstacles: Set<string>
} => {
    const grid = mapGrid(makeGrid(input), (cell, position) => ({
        cell,
        position,
    }))

    const { position } = safe(grid.flat().find(({ cell }) => cell === "^"))

    return {
        grid,
        guard: { facing: "n", position },
        obstacles: new Set(
            grid
                .flat()
                .filter(({ cell }) => cell === "#")
                .map(({ position: { c, r } }) => makeHash(r, c)),
        ),
    }
}

const getNextDirection = (
    facing: string,
): ((position: Position) => Position) =>
    facing === "n" ? north
    : facing === "s" ? south
    : facing === "e" ? east
    : west

const getNextDistance = (
    { facing, position: { c, r } }: { facing: string; position: Position },
    size: number,
): number =>
    facing === "n" ? r
    : facing === "s" ? size - 1 - r
    : facing === "e" ? size - 1 - c
    : c

const getPath = (
    guard: { facing: string; position: Position },
    size: number,
): Position[] =>
    pathGrid(
        guard.position,
        getNextDirection(guard.facing),
        getNextDistance(guard, size),
    )

const edge = (position: Position, size: number): boolean =>
    position.r === 0 ||
    position.c === 0 ||
    position.r === size - 1 ||
    position.c === size - 1

export const move = (
    {
        grid,
        guard,
        obstacles,
    }: {
        grid: Grid<{ cell: string; position: Position }>
        guard: { facing: string; position: Position }
        obstacles: Set<string>
    },
    visited: Set<string>,
): { facing: string; position: Position } => {
    const path = getPath(guard, grid.length)
    const obstacleIndex = path.findIndex((position) => {
        if (obstacles.has(makeHash(position.r, position.c))) return true

        visited.add(makeHash(position.r, position.c, guard.facing)) // eslint-disable-line functional/no-expression-statements, no-restricted-syntax

        return false
    })

    return {
        facing:
            guard.facing === "n" ? "e"
            : guard.facing === "s" ? "w"
            : guard.facing === "e" ? "s"
            : "n",
        position: at(
            path.slice(0, obstacleIndex === -1 ? Infinity : obstacleIndex),
            -1,
        ),
    }
}

const navigate = (
    {
        grid,
        guard,
        obstacles,
    }: {
        grid: Grid<{ cell: string; position: Position }>
        guard: { facing: string; position: Position }
        obstacles: Set<string>
    },
    visited: Set<string> = new Set(),
): {
    guard: { facing: string; position: Position }
    visited: Set<string>
} =>
    (
        visited.has(
            makeHash(guard.position.r, guard.position.c, guard.facing),
        ) || edge(guard.position, grid.length)
    ) ?
        { guard, visited }
    :   navigate(
            {
                grid,
                guard: move({ grid, guard, obstacles }, visited),
                obstacles,
            },
            visited,
        )

const getVisited = (payload: {
    grid: Grid<{ cell: string; position: Position }>
    guard: { facing: string; position: Position }
    obstacles: Set<string>
}): string[] =>
    unique(
        [...navigate(payload).visited].map((string) =>
            makeHash(...string.split("_").slice(0, -1)),
        ),
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => getVisited(parse(input)).length

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const { grid, guard, obstacles } = parse(input)

    return count(
        getVisited({ grid, guard, obstacles }).filter(
            (positionHash) =>
                positionHash !==
                    makeHash(
                        north(guard.position).r,
                        north(guard.position).c,
                    ) &&
                positionHash !== makeHash(guard.position.r, guard.position.c),
        ),
        (possibleObstacle) =>
            !edge(
                navigate(
                    {
                        grid,
                        guard,
                        obstacles: new Set([possibleObstacle, ...obstacles]),
                    },
                    new Set(),
                ).guard.position,
                grid.length,
            ),
    )
}
