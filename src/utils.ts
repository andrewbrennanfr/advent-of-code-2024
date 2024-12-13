export type Coordinate = Record<"x" | "y" | "z", number>

export type Grid<T> = T[][]

export type Position = Record<"c" | "r", number>

/* -------------------------------------------------------------------------- */

export const $ =
    <T extends unknown[], U>(
        function_: (...arguments_: T) => U,
        hash: (arguments_: T) => string = (arguments_) =>
            JSON.stringify(
                arguments_.map((argument) =>
                    typeof argument === "function" ? argument.name : argument,
                ),
            ),
        cache: Record<string, U> = {},
    ): typeof function_ =>
    (...arguments_) =>
        (cache[hash(arguments_)] ??= function_(...arguments_)) // eslint-disable-line functional/immutable-data

export const always =
    <T>(value: T): (() => T) =>
    // eslint-disable-next-line functional/functional-parameters
    () =>
        value

export const at = <T>(array: T[], index: number): NonNullable<T> =>
    guard(array[(index + array.length) % array.length])

export const back = ({ x, y, z }: Coordinate): Coordinate => ({
    x,
    y,
    z: z - 1,
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

export const between = (left: number, number: number, right: number): boolean =>
    (left <= number && number <= right) || (left >= number && number >= right)

export const cell = <T>(grid: Grid<T>, { c, r }: Position): T | undefined =>
    grid[r]?.[c]

export const clockwise = <T>(
    [first = [], ...grid]: Grid<T>,
    degrees = 90,
): Grid<T> =>
    degrees === 0 ?
        [first, ...grid]
    :   clockwise(
            first.map((cell, index) =>
                [cell, ...grid.map((row) => at(row, index))].toReversed(),
            ),
            degrees - 90,
        )

export const count = <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
): number => array.filter(predicate).length

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

export const defined = <T>(value: T): value is NonNullable<T> =>
    value !== null && value !== undefined // eslint-disable-line no-undefined

export const distance = (left: number, right: number): number =>
    Math.abs(left - right)

export const down = ({ x, y, z }: Coordinate): Coordinate => ({
    x,
    y: y - 1,
    z,
})

export const downLeft = (coordinate: Coordinate): Coordinate =>
    down(left(coordinate))

export const downRight = (coordinate: Coordinate): Coordinate =>
    down(right(coordinate))

export const east = ({ c, r }: Position): Position => ({ c: c + 1, r })

export const even = (number: number): boolean => number % 2 === 0

export const front = ({ x, y, z }: Coordinate): Coordinate => ({
    x,
    y,
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

export const grid = (
    string: string,
    separator: RegExp | string = "",
): Grid<string> =>
    string
        .trim()
        .split("\n")
        .map((line) => line.split(separator))

export const guard = <T>(value: T): NonNullable<T> =>
    value ?? panic(`${String(value)} did not pass guard!`)

export const left = ({ x, y, z }: Coordinate): Coordinate => ({
    x: x - 1,
    y,
    z,
})

export const hash = (...values: (number | string)[]): string => values.join("_")

export const manhattan = (left: Position, right: Position): number =>
    distance(left.r, right.r) + distance(left.c, right.c)

export const map2D = <T, U>(
    grid: Grid<T>,
    iteratee: (cell: T, position: Position, grid: Grid<T>) => U,
): Grid<U> =>
    grid.map((row, r) => row.map((cell, c) => iteratee(cell, { c, r }, grid)))

export const match = (
    string: string,
    regex: RegExp,
): (Omit<RegExpExecArray, "groups"> &
    Required<Pick<RegExpExecArray, "groups">>)[] =>
    [...string.matchAll(regex)].map(({ groups, ...match }) => ({
        ...match,
        groups: { ...groups },
    }))

export const north = ({ c, r }: Position): Position => ({ c, r: r - 1 })

export const northEast = (position: Position): Position => north(east(position))

export const northWest = (position: Position): Position => north(west(position))

export const odd = (number: number): boolean => !even(number)

export const order = <T>(array: T[]): T[] =>
    sort(array, (left, right) =>
        left < right ? -1
        : right > left ? 1
        : 0,
    )

export const panic = (message: string): never => {
    throw new Error(message) // eslint-disable-line functional/no-throw-statements
}

export const path2D = $(
    (
        start: Position,
        direction: (position: Position) => Position,
        moves: number,
    ): Position[] =>
        moves === 0 ?
            [start]
        :   [start, ...path2D(direction(start), direction, moves - 1)],
)

export const path3D = $(
    (
        start: Coordinate,
        direction: (position: Coordinate) => Coordinate,
        moves: number,
    ): Coordinate[] =>
        moves === 0 ?
            [start]
        :   [start, ...path3D(direction(start), direction, moves - 1)],
)

export const product = (numbers: number[]): number =>
    numbers.reduce((left, right) => left * right, Number(numbers.length > 0))

export const right = ({ x, y, z }: Coordinate): Coordinate => ({
    x: x + 1,
    y,
    z,
})

export const sort = <T>(
    array: T[],
    compare: (left: T, right: T) => number,
): T[] => array.toSorted(compare)

export const south = ({ c, r }: Position): Position => ({ c, r: r + 1 })

export const southEast = (position: Position): Position => south(east(position))

export const southWest = (position: Position): Position => south(west(position))

export const square = (
    position: Position,
): Record<
    | "east"
    | "north"
    | "northEast"
    | "northWest"
    | "south"
    | "southEast"
    | "southWest"
    | "west",
    Position
> => ({
    east: east(position),
    north: north(position),
    northEast: northEast(position),
    northWest: northWest(position),
    south: south(position),
    southEast: southEast(position),
    southWest: southWest(position),
    west: west(position),
})

export const sum = (numbers: number[]): number =>
    numbers.reduce((left, right) => left + right, 0)

export const unhash = (hash: string): string[] => hash.split("_")

export const unique = <T>(
    array: T[],
    hash: (value: T, index: number, array: T[]) => string = String,
): T[] => {
    const lookup = Object.fromEntries(
        array.map((value, index) => [hash(value, index, array), value]),
    )

    return [...new Set(array.map(hash))].map((hash) => guard(lookup[hash]))
}

export const up = ({ x, y, z }: Coordinate): Coordinate => ({ x, y: y + 1, z })

export const upLeft = (coordinate: Coordinate): Coordinate =>
    up(left(coordinate))

export const upRight = (coordinate: Coordinate): Coordinate =>
    up(right(coordinate))

export const west = ({ c, r }: Position): Position => ({ c: c - 1, r })
