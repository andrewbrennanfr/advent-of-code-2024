import * as U from "@/utils"

const parse = (
    input: string,
): {
    grid: {
        cell: string
        position: U.Position
    }[][]
    guard: { facing: string; position: U.Position }
    obstacles: Set<string>
} => {
    const grid = U.map2D(U.grid(input), (cell, position) => ({
        cell,
        position,
    }))

    const { position } = U.guard(grid.flat().find(({ cell }) => cell === "^"))

    return {
        grid,
        guard: { facing: "n", position },
        obstacles: new Set(
            grid
                .flat()
                .filter(({ cell }) => cell === "#")
                .map(({ position }) => getHash(position)),
        ),
    }
}

const getHash = ({ c, r }: U.Position, facing = ""): string =>
    `${r}_${c}_${facing}`

const getNextDirection = ({
    facing,
}: {
    facing: string
    position: U.Position
}): ((position: U.Position) => U.Position) =>
    facing === "n" ? U.north
    : facing === "s" ? U.south
    : facing === "e" ? U.east
    : U.west

const getNextDistance = (
    { facing, position: { c, r } }: { facing: string; position: U.Position },
    size: number,
): number =>
    facing === "n" ? r
    : facing === "s" ? size - 1 - r
    : facing === "e" ? size - 1 - c
    : c

const getPath = (
    guard: { facing: string; position: U.Position },
    size: number,
): U.Position[] =>
    U.path(
        guard.position,
        getNextDirection(guard),
        getNextDistance(guard, size),
    )

const isEdge = (position: U.Position, size: number): boolean =>
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
        grid: { cell: string; position: U.Position }[][]
        guard: { facing: string; position: U.Position }
        obstacles: Set<string>
    },
    visited: Set<string>,
): { facing: string; position: U.Position } => ({
    facing:
        guard.facing === "n" ? "e"
        : guard.facing === "s" ? "w"
        : guard.facing === "e" ? "s"
        : "n",
    position: U.at(
        U.until(getPath(guard, grid.length), (position) => {
            if (obstacles.has(getHash(position))) return true

            visited.add(getHash(position, guard.facing)) // eslint-disable-line functional/no-expression-statements, no-restricted-syntax

            return false
        }),
        -1,
    ),
})

const navigate = (
    {
        grid,
        guard,
        obstacles,
    }: {
        grid: { cell: string; position: U.Position }[][]
        guard: { facing: string; position: U.Position }
        obstacles: Set<string>
    },
    visited: Set<string> = new Set(),
): {
    guard: { facing: string; position: U.Position }
    visited: Set<string>
} =>
    (
        visited.has(getHash(guard.position, guard.facing)) ||
        isEdge(guard.position, grid.length)
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
    grid: { cell: string; position: U.Position }[][]
    guard: { facing: string; position: U.Position }
    obstacles: Set<string>
}): string[] =>
    U.unique(
        [...navigate(payload).visited].map((string) =>
            U.slice(string, 0, string.length - 1),
        ),
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => getVisited(parse(input)).length

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const { grid, guard, obstacles } = parse(input)

    return U.count(
        getVisited({ grid, guard, obstacles }).filter(
            (hash) =>
                hash !== getHash(U.north(guard.position)) &&
                hash !== getHash(guard.position),
        ),
        (possibleObstacle) =>
            !isEdge(
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
