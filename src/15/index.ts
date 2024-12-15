import { at, unique } from "@/array"
import {
    atPosition,
    east,
    type Grid,
    makeGrid,
    mapGrid,
    north,
    pathGrid,
    type Position,
    south,
    unsafeAtPosition,
    west,
} from "@/grid"
import { mutateGrid } from "@/mutation"
import { sum } from "@/number"
import { isDefined, makeHash, panic, safe } from "@/utils"

const parse = (
    input: string,
): {
    grid: Grid<string>
    moves: string[]
    robot: Position
} => {
    const chunks = input.trim().split("\n\n")
    const grid = makeGrid(at(chunks, 0).trim())
    const robotR = grid.findIndex((row) => row.find((cell) => cell === "@"))
    const robotC = safe(at(grid, robotR)).indexOf("@")

    const moves = [...at(chunks, 1).trim()].filter(
        (move) => move.trim().length > 0,
    )

    return { grid, moves, robot: { c: robotC, r: robotR } }
}

const getRowsAbove = (grid: Grid<string>, position: Position): Position[] => {
    const above = north(position)

    if (!isDefined(unsafeAtPosition(grid, above))) return []

    const cell = atPosition(grid, above)

    if (cell !== "[" && cell !== "]" && cell !== "#") return []

    const row =
        cell === "[" ? [above, east(above)]
        : cell === "]" ? [west(above), above]
        : [above]

    if (row.some((rowPosition) => atPosition(grid, rowPosition) === "#"))
        return row

    return unique(
        [
            ...row,
            ...row.flatMap((rowPosition) => getRowsAbove(grid, rowPosition)),
        ],
        ({ c, r }) => makeHash(r, c),
    )
}

const getRowsBelow = (grid: Grid<string>, position: Position): Position[] => {
    const below = south(position)

    if (!isDefined(unsafeAtPosition(grid, below))) return []

    const cell = atPosition(grid, below)

    if (cell !== "[" && cell !== "]" && cell !== "#") return []

    const row =
        cell === "[" ? [below, east(below)]
        : cell === "]" ? [west(below), below]
        : [below]

    if (row.some((rowPosition) => atPosition(grid, rowPosition) === "#"))
        return row

    return unique(
        [
            ...row,
            ...row.flatMap((rowPosition) => getRowsBelow(grid, rowPosition)),
        ],
        ({ c, r }) => makeHash(r, c),
    )
}

const canMoveRowUp = (grid: Grid<string>, positions: Position[]): boolean => {
    if (positions.some((position) => atPosition(grid, position) === "#"))
        return false

    const mostNorthRow = Math.min(...positions.map(({ r }) => r))
    const topRow = positions.filter(({ r }) => r === mostNorthRow)

    const rowAbove = topRow.map(north)

    return rowAbove.every((position) => atPosition(grid, position) === ".")
}

const canMoveRowDown = (grid: Grid<string>, positions: Position[]): boolean => {
    if (positions.some((position) => atPosition(grid, position) === "#"))
        return false

    const mostSouthRow = Math.max(...positions.map(({ r }) => r))
    const bottomRow = positions.filter(({ r }) => r === mostSouthRow)

    const rowBelow = bottomRow.map(south)

    return rowBelow.every((position) => atPosition(grid, position) === ".")
}

const complexMove = (
    move: string,
    robot: Position,
    grid: Grid<string>,
): {
    grid: Grid<string>
    robot: Position
} => {
    const direction =
        move === "^" ? north
        : move === "v" ? south
        : panic("No direction could be found")

    if (direction === north) {
        const nextRobot = north(robot)
        const rowsAbove = getRowsAbove(grid, robot)

        if (canMoveRowUp(grid, rowsAbove)) {
            const rAbove = rowsAbove.map(({ r }) => r)
            const mostSouthRow = Math.max(...rAbove)
            const mostNorthRow = Math.min(...rAbove)

            const mutations = rowsAbove.reduce<[Position, string][]>(
                (nextMutations, position) => {
                    const below = south(position)
                    const cellBelow = atPosition(grid, below)
                    const above = north(position)
                    const cell = atPosition(grid, position)

                    if (
                        position.r === mostNorthRow &&
                        position.r === mostSouthRow
                    )
                        return [
                            ...nextMutations,
                            [position, "."],
                            [above, cell],
                        ]

                    return [
                        ...nextMutations,
                        (
                            rowsAbove.some(
                                ({ c, r }) => c === below.c && r === below.r,
                            )
                        ) ?
                            [position, cellBelow]
                        :   [position, "."],
                        [above, cell],
                    ]
                },
                [],
            )

            const nextGrid = mutateGrid(grid, [
                ...mutations,
                [robot, "."],
                [nextRobot, "@"],
            ])

            return { grid: nextGrid, robot: nextRobot }
        }
    }

    if (direction === south) {
        const nextRobot = south(robot)
        const rowsBelow = getRowsBelow(grid, robot)

        if (canMoveRowDown(grid, rowsBelow)) {
            const rBelow = rowsBelow.map(({ r }) => r)
            const mostSouthRow = Math.max(...rBelow)
            const mostNorthRow = Math.min(...rBelow)

            const mutations = rowsBelow.reduce<[Position, string][]>(
                (nextMutations, position) => {
                    const above = north(position)
                    const cellAbove = atPosition(grid, above)
                    const below = south(position)
                    const cell = atPosition(grid, position)

                    if (
                        position.r === mostNorthRow &&
                        position.r === mostSouthRow
                    )
                        return [
                            ...nextMutations,
                            [position, "."],
                            [below, cell],
                        ]

                    return [
                        ...nextMutations,
                        (
                            rowsBelow.some(
                                ({ c, r }) => c === above.c && r === above.r,
                            )
                        ) ?
                            [position, cellAbove]
                        :   [position, "."],
                        [below, cell],
                    ]
                },
                [],
            )

            const nextGrid = mutateGrid(grid, [
                ...mutations,
                [robot, "."],
                [nextRobot, "@"],
            ])

            return { grid: nextGrid, robot: nextRobot }
        }
    }

    return { grid, robot }
}

const moveRobot = (
    move: string,
    robot: Position,
    grid: Grid<string>,
): {
    grid: Grid<string>
    robot: Position
} => {
    const direction =
        move === "^" ? north
        : move === ">" ? east
        : move === "v" ? south
        : move === "<" ? west
        : panic("No direction could be found")

    const firstRow = at(grid, 0)
    const next = at(pathGrid(robot, direction, 1), -1)
    const nextCell = atPosition(grid, next)

    if (nextCell === "#") return { grid, robot }

    if (nextCell === ".")
        return {
            grid: mutateGrid(grid, [
                [next, "@"],
                [robot, "."],
            ]),
            robot: next,
        }

    if (
        (direction === north && nextCell === "[") ||
        (direction === north && nextCell === "]") ||
        (direction === south && nextCell === "[") ||
        (direction === south && nextCell === "]")
    )
        return complexMove(move, robot, grid)

    if (nextCell !== "." && nextCell !== "#") {
        const distance =
            direction === north ? robot.r
            : direction === south ? grid.length - 1 - robot.r
            : direction === east ? firstRow.length - 1 - robot.c
            : direction === west ? robot.c
            : panic("No direction could be found")

        const path = pathGrid(robot, direction, distance)
        const nextPosition = at(path, 1)

        const firstSpaceIndex = path.findIndex((position) => {
            const cell = atPosition(grid, position)

            return cell === "."
        })

        const firstWallIndex = path.findIndex((position) => {
            const cell = atPosition(grid, position)

            return cell === "#"
        })

        if (firstWallIndex < firstSpaceIndex) return { grid, robot }

        if (firstSpaceIndex === -1) return { grid, robot }

        const pathUntilSpace = path.slice(0, firstSpaceIndex + 1)
        const mutations = pathUntilSpace.reduce<[Position, string][]>(
            (nextMutations, position, index) => {
                if (index === 0) return [...nextMutations, [position, "."]]

                const beforePosition = at(pathUntilSpace, index - 1)
                const before = atPosition(grid, beforePosition)

                return [...nextMutations, [position, before]]
            },
            [],
        )

        return { grid: mutateGrid(grid, mutations), robot: nextPosition }
    }

    return { grid, robot }
}

const makeMoves = (
    {
        grid,
        moves,
        robot,
    }: {
        grid: Grid<string>
        moves: string[]
        robot: Position
    },
    times: number,
    index = 0,
): {
    grid: Grid<string>
    robot: Position
} => {
    if (times === 0) return { grid, robot }

    const moveToMake = at(moves, index)

    const { grid: nextGrid, robot: nextRobot } = moveRobot(
        moveToMake,
        robot,
        grid,
    )

    return makeMoves(
        {
            grid: nextGrid,
            moves,
            robot: nextRobot,
        },
        times - 1,
        index + 1,
    )
}

const expand = (
    grid: Grid<string>,
): { grid: Grid<string>; robot: Position } => {
    const joinedGrid = grid
        .map((row) =>
            row
                .flatMap((cell) => {
                    if (cell === "@") return ["@", "."]

                    if (cell === "O") return ["[", "]"]

                    return [cell, cell]
                })
                .join(""),
        )
        .join("\n")

    const nextGrid = makeGrid(joinedGrid.trim())
    const robotR = nextGrid.findIndex((row) => row.find((cell) => cell === "@"))
    const robotC = safe(at(nextGrid, robotR)).indexOf("@")

    return {
        grid: nextGrid,
        robot: { c: robotC, r: robotR },
    }
}

const evaluate = (grid: Grid<string>): number => {
    const cells = mapGrid(grid, (cell, position) => ({ cell, position })).flat()
    const boxes = cells.filter(({ cell }) => cell === "O")
    const boxPositions = boxes.map(({ position }) => position)
    const gps = boxPositions.map(({ c, r }) => 100 * r + c)

    return sum(gps)
}

const expandedEvaluate = (grid: Grid<string>): number => {
    const cells = mapGrid(grid, (cell, position) => ({ cell, position })).flat()
    const boxes = cells.filter(({ cell }) => cell === "[")
    const boxPositions = boxes.map(({ position }) => position)
    const gps = boxPositions.map(({ c, r }) => 100 * r + c)

    return sum(gps)
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const data = parse(input)
    const moved = makeMoves(data, data.moves.length - 1)

    return evaluate(moved.grid)
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const data = parse(input)
    const { grid: expandedGrid, robot: expandedRobot } = expand(data.grid)
    const moved = makeMoves(
        { ...data, grid: expandedGrid, robot: expandedRobot },
        data.moves.length - 1,
    )

    return expandedEvaluate(moved.grid)
}
