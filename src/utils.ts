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

export const cousins = (
    position: Position,
): Record<"northEast" | "northWest" | "southEast" | "southWest", Position> => ({
    northEast: northEast(position),
    northWest: northWest(position),
    southEast: southEast(position),
    southWest: southWest(position),
})

export const defined = <T>(value: T): value is NonNullable<T> =>
    value !== null && value !== undefined // eslint-disable-line no-undefined

export const distance = (left: number, right: number): number =>
    Math.abs(left - right)

export const east = ({ c, r }: Position): Position => ({ c: c + 1, r })

export const even = (number: number): boolean => number % 2 === 0

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

export const path = $(
    (
        start: Position,
        direction: (position: Position) => Position,
        moves: number,
    ): Position[] =>
        moves === 0 ?
            [start]
        :   [start, ...path(direction(start), direction, moves - 1)],
)

export const product = (numbers: number[]): number =>
    numbers.reduce((left, right) => left * right, Number(numbers.length > 0))

export const siblings = (
    position: Position,
): Record<"east" | "north" | "south" | "west", Position> => ({
    east: east(position),
    north: north(position),
    south: south(position),
    west: west(position),
})

export const sort = <T>(
    array: T[],
    compare: (left: T, right: T) => number,
): T[] => array.toSorted(compare)

export const south = ({ c, r }: Position): Position => ({ c, r: r + 1 })

export const southEast = (position: Position): Position => south(east(position))

export const southWest = (position: Position): Position => south(west(position))

export const surrounding = (
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
> => ({ ...cousins(position), ...siblings(position) })

export const sum = (numbers: number[]): number =>
    numbers.reduce((left, right) => left + right, 0)

export const unique = <T>(
    array: T[],
    hash: (value: T, index: number, array: T[]) => string = String,
): T[] => {
    const lookup = Object.fromEntries(
        array.map((value, index) => [hash(value, index, array), value]),
    )

    return [...new Set(array.map(hash))].map((hash) => guard(lookup[hash]))
}

export const west = ({ c, r }: Position): Position => ({ c: c - 1, r })
