import { memo } from "@/utils"

export type Coordinate = Record<"x" | "y" | "z", number>

export type Graph2D<T> = T[][]

export type Graph3D<T> = T[][][]

/* -------------------------------------------------------------------------- */

export const up = ({ y, ...coordinate }: Coordinate): Coordinate => ({
    ...coordinate,
    y: y + 1,
})

export const back = ({ z, ...coordinate }: Coordinate): Coordinate => ({
    ...coordinate,
    z: z - 1,
})

export const right = ({ x, ...coordinate }: Coordinate): Coordinate => ({
    ...coordinate,
    x: x + 1,
})

export const down = ({ y, ...coordinate }: Coordinate): Coordinate => ({
    ...coordinate,
    y: y - 1,
})

export const left = ({ x, ...coordinate }: Coordinate): Coordinate => ({
    ...coordinate,
    x: x - 1,
})

export const backDown = (coordinate: Coordinate): Coordinate =>
    back(down(coordinate))

export const backDownLeft = (coordinate: Coordinate): Coordinate =>
    backDown(left(coordinate))

export const backDownRight = (coordinate: Coordinate): Coordinate =>
    backDown(right(coordinate))

export const backLeft = (coordinate: Coordinate): Coordinate =>
    back(left(coordinate))

export const backRight = (coordinate: Coordinate): Coordinate =>
    back(right(coordinate))

export const backUp = (coordinate: Coordinate): Coordinate =>
    back(up(coordinate))

export const backUpLeft = (coordinate: Coordinate): Coordinate =>
    backUp(left(coordinate))

export const backUpRight = (coordinate: Coordinate): Coordinate =>
    backUp(right(coordinate))

export const downLeft = (coordinate: Coordinate): Coordinate =>
    down(left(coordinate))

export const downRight = (coordinate: Coordinate): Coordinate =>
    down(right(coordinate))

export const front = ({ z, ...coordinate }: Coordinate): Coordinate => ({
    ...coordinate,
    z: z + 1,
})

export const frontDown = (coordinate: Coordinate): Coordinate =>
    front(down(coordinate))

export const frontDownLeft = (coordinate: Coordinate): Coordinate =>
    frontDown(left(coordinate))

export const frontDownRight = (coordinate: Coordinate): Coordinate =>
    frontDown(right(coordinate))

export const frontLeft = (coordinate: Coordinate): Coordinate =>
    front(left(coordinate))

export const frontRight = (coordinate: Coordinate): Coordinate =>
    front(right(coordinate))

export const frontUp = (coordinate: Coordinate): Coordinate =>
    front(up(coordinate))

export const frontUpLeft = (coordinate: Coordinate): Coordinate =>
    frontUp(left(coordinate))

export const frontUpRight = (coordinate: Coordinate): Coordinate =>
    frontUp(right(coordinate))

export const pathGraph = memo(
    (
        start: Coordinate,
        direction: (position: Coordinate) => Coordinate,
        moves: number,
    ): Coordinate[] =>
        moves === 0 ?
            [start]
        :   [start, ...pathGraph(direction(start), direction, moves - 1)],
)

export const upLeft = (coordinate: Coordinate): Coordinate =>
    up(left(coordinate))

export const upRight = (coordinate: Coordinate): Coordinate =>
    up(right(coordinate))

// eslint-disable-next-line max-lines-per-function
export const cube = (
    coordinate: Coordinate,
): Record<
    | "back"
    | "backDown"
    | "backDownLeft"
    | "backDownRight"
    | "backLeft"
    | "backRight"
    | "backUp"
    | "backUpLeft"
    | "backUpRight"
    | "down"
    | "downLeft"
    | "downRight"
    | "front"
    | "frontDown"
    | "frontDownLeft"
    | "frontDownRight"
    | "frontLeft"
    | "frontRight"
    | "frontUp"
    | "frontUpLeft"
    | "frontUpRight"
    | "left"
    | "right"
    | "up"
    | "upLeft"
    | "upRight",
    Coordinate
> => ({
    back: back(coordinate),
    backDown: backDown(coordinate),
    backDownLeft: backDownLeft(coordinate),
    backDownRight: backDownRight(coordinate),
    backLeft: backLeft(coordinate),
    backRight: backRight(coordinate),
    backUp: backUp(coordinate),
    backUpLeft: backUpLeft(coordinate),
    backUpRight: backUpRight(coordinate),
    down: down(coordinate),
    downLeft: downLeft(coordinate),
    downRight: downRight(coordinate),
    front: front(coordinate),
    frontDown: frontDown(coordinate),
    frontDownLeft: frontDownLeft(coordinate),
    frontDownRight: frontDownRight(coordinate),
    frontLeft: frontLeft(coordinate),
    frontRight: frontRight(coordinate),
    frontUp: frontUp(coordinate),
    frontUpLeft: frontUpLeft(coordinate),
    frontUpRight: frontUpRight(coordinate),
    left: left(coordinate),
    right: right(coordinate),
    up: up(coordinate),
    upLeft: upLeft(coordinate),
    upRight: upRight(coordinate),
})
