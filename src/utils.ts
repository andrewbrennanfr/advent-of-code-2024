export type Flip<T extends unknown[]> =
    T extends [infer U, ...infer V] ? [...Flip<V>, U] : []

export type Position = Record<"c" | "r", number>

/* -------------------------------------------------------------------------- */

export const λ =
    <T extends unknown[], U extends unknown[], V>(
        function_: (...arguments_: [...T, ...U]) => V,
        ...partial: T
    ): ((...remaining: U) => V) =>
    (...remaining) =>
        function_(...partial, ...remaining)

export const $ =
    <T extends unknown[], U>(
        function_: (...arguments_: T) => U,
        hash: (arguments_: T) => string = (arguments_) =>
            stringify(
                map(arguments_, (argument) =>
                    argument instanceof Function && "name" in argument ?
                        argument.name
                    :   argument,
                ),
            ),
        cache: Record<string, U> = {},
    ): typeof function_ =>
    (...arguments_) =>
        (cache[hash(arguments_)] ??= function_(...arguments_)) // eslint-disable-line functional/immutable-data

export const _ =
    <T extends unknown[], U>(
        function_: (...arguments_: T) => U,
    ): ((...arguments_: Flip<T>) => U) =>
    (...arguments_: Flip<T>) =>
        function_(...(reverse(subset(arguments_, 0, function_.length)) as T))

export const add = (left: number, right: number): number => left + right

export const always =
    <T>(value: T): (() => T) =>
    // eslint-disable-next-line functional/functional-parameters
    () =>
        value

export const apply = <T, U>(
    function_: (...arguments_: T[]) => U,
    arguments_: T[],
): U => function_(...arguments_)

export const array = <T>(size: number, iteratee: (index: number) => T): T[] =>
    map(Array.from({ length: size }, index), iteratee)

export const at = <T>(array: T[], index: number): NonNullable<T> =>
    guard(array[modulus(add(index, length(array)), length(array))])

export const c = (position: Position): Position["c"] => property(position, "c")

export const cell = <T>(grid: T[][], { c, r }: Position): T | undefined =>
    grid[r]?.[c]

export const clockwise = <T>(grid: T[][], degrees = 90): T[][] =>
    isEqual(degrees, 0) ? grid : (
        clockwise(
            map(first(grid), (cell, index) =>
                reverse([cell, ...map(without(grid, 0), λ(_(at), index))]),
            ),
            subtract(degrees, 90),
        )
    )

export const converge = <T>(
    arrays: T[][],
    combine: (left: T, right: T, arrays: [T[], T[]]) => T,
): T[] =>
    reduce(
        tail(arrays),
        (left, right) =>
            map(left, (_, index) =>
                combine(at(left, index), at(right, index), [left, right]),
            ),
        first(arrays),
    )

export const count = <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
): number => length(filter(array, predicate))

export const cousins = (
    position: Position,
): Record<"northEast" | "northWest" | "southEast" | "southWest", Position> => ({
    northEast: northEast(position),
    northWest: northWest(position),
    southEast: southEast(position),
    southWest: southWest(position),
})

export const distance = (left: number, right: number): number =>
    Math.abs(subtract(left, right))

export const divide = (left: number, right: number): number => left / right

export const east = ({ c, r }: Position): Position => ({ c: add(c, 1), r })

export const every = <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
): boolean => array.every(predicate)

export const filter = <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
): T[] => array.filter(predicate)

export const find = <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
): T | undefined => array.find(predicate)

export const findIndex = <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
): number => array.findIndex(predicate)

export const first = <T>(array: T[]): T => at(array, 0)

export const flat = <T>(grid: T[][]): T[] => grid.flat()

export const flatMap = <T, U>(
    array: T[],
    iteratee: (value: T, index: number, array: T[]) => U[],
): U[] => array.flatMap(iteratee)

export const fromEntries = <T>(entries: [string, T][]): Record<string, T> =>
    Object.fromEntries(entries)

export const grid = (
    string: string,
    separator: RegExp | string = "",
): string[][] => map(lines(string), λ(_(split), separator))

export const guard = <T>(value: T): NonNullable<T> =>
    isDefined(value) ? value : panic(`${String(value)} did not pass guard!`)

export const half = (number: number): number => divide(number, 2)

export const head = <T>(array: T[]): T[] =>
    without(array, subtract(length(array), 1))

export const index = <T>(_: unknown, index: T): T => index

export const isAscending = (numbers: number[]): boolean =>
    isFollowing(numbers, isGreaterEqual)

export const isBetween = (
    left: number,
    number: number,
    right: number,
): boolean =>
    (isLessEqual(left, number) && isLessEqual(number, right)) ||
    (isLessEqual(right, number) && isLessEqual(number, left))

export const isDefined = <T>(value: T): value is NonNullable<T> =>
    isNot(isEqual)(value, null) && isNot(isEqual)(value, undefined) // eslint-disable-line no-undefined, unicorn/no-null, unicorn/no-useless-undefined

export const isDescending = (numbers: number[]): boolean =>
    isAscending(reverse(numbers))

export const isEqual = <T>(left: T, right: T): boolean => left === right

export const isEven = (number: number): boolean => isZero(modulus(number, 2))

export const isFollowing = <T>(
    array: T[],
    predicate: (left: T, right: T) => boolean,
): boolean =>
    every(
        array,
        (value, index) =>
            isZero(index) || predicate(at(array, subtract(index, 1)), value),
    )

export const isGreater = <T>(left: T, right: T): boolean => left > right

export const isGreaterEqual = <T>(left: T, right: T): boolean =>
    isGreater(left, right) || isEqual(left, right)

export const isIncluded = <T>(array: T[], value: T): boolean =>
    array.includes(value)

export const isLess = <T>(left: T, right: T): boolean => left < right

export const isLessEqual = <T>(left: T, right: T): boolean =>
    isLess(left, right) || isEqual(left, right)

export const isNot =
    <T extends unknown[]>(
        predicate: (...arguments_: T) => boolean,
    ): ((...arguments_: T) => boolean) =>
    (...arguments_) =>
        !predicate(...arguments_)

export const isOdd = (number: number): boolean => isNot(isEven)(number)

export const isZero = (number: number): boolean => isEqual(number, 0)

export const int = (value: unknown): number => Number(value) // eslint-disable-line functional/prefer-tacit, unicorn/prefer-native-coercion-functions

export const join = (array: (number | string)[], separator = ""): string =>
    array.join(separator)

export const last = <T>(array: T[]): T => at(array, -1)

export const lastIndexOf = (string: string, value: string): number =>
    string.lastIndexOf(value)

export const length = (value: string | unknown[]): number => value.length

export const lines = (string: string): string[] => split(trim(string), "\n")

export const manhattan = (left: Position, right: Position): number =>
    add(distance(r(left), r(right)), distance(c(left), c(right)))

export const map = <T, U>(
    array: T[],
    iteratee: (value: T, index: number, array: T[]) => U,
): U[] => array.map(iteratee)

export const map2D = <T, U>(
    grid: T[][],
    iteratee: (cell: T, position: Position, grid: T[][]) => U,
): U[][] =>
    map(grid, (row, r) => map(row, (cell, c) => iteratee(cell, { c, r }, grid)))

export const match = (
    string: string,
    regex: RegExp,
): (Omit<RegExpExecArray, "groups"> &
    Required<Pick<RegExpExecArray, "groups">>)[] =>
    map([...string.matchAll(regex)], ({ groups, ...match }) => ({
        ...match,
        groups: { ...groups },
    }))

export const middle = <T>(array: T[]): T =>
    at(array, half(subtract(length(array), 1)))

export const modulus = (left: number, right: number): number => left % right

export const multiply = (left: number, right: number): number => left * right

export const north = ({ c, r }: Position): Position => ({
    c,
    r: subtract(r, 1),
})

export const northEast = (position: Position): Position => north(east(position))

export const northWest = (position: Position): Position => north(west(position))

export const order = <T>(array: T[]): T[] => sort(array)

export const panic = (message: string): never => {
    throw new Error(message) // eslint-disable-line functional/no-throw-statements
}

export const path = $(
    (
        start: Position,
        direction: (position: Position) => Position,
        moves: number,
    ): Position[] =>
        isZero(moves) ?
            [start]
        :   [start, ...path(direction(start), direction, subtract(moves, 1))],
)

export const produce = <T>(
    array: T[],
    producer: (left: T, right: T, index: number) => T[],
): T[] =>
    reduce(
        array,
        (left, right) =>
            isZero(length(left)) ?
                [right]
            :   flatMap(left, (value, index) => producer(value, right, index)),
        [] as T[],
    )

export const product = (numbers: number[]): number =>
    reduce(numbers, multiply, int(isGreater(length(numbers), 0)))

export const property = <T>(object: Record<string, T>, key: string): T =>
    guard(object[key])

export const r = (position: Position): Position["r"] => property(position, "r")

export const reduce = <T, U>(
    array: T[],
    reducer: (left: U, right: T, index: number, array: T[]) => U, // eslint-disable-line @typescript-eslint/max-params
    left: U,
): U => array.reduce(reducer, left)

export const reverse = <T>(array: T[]): T[] => array.toReversed()

export const siblings = (
    position: Position,
): Record<"east" | "north" | "south" | "west", Position> => ({
    east: east(position),
    north: north(position),
    south: south(position),
    west: west(position),
})

export const slice = (string: string, start: number, size: number): string =>
    string.slice(start, start + size)

export const slices = (string: string, size: number): string[] =>
    isLessEqual(length(string), size) ?
        [string]
    :   [
            slice(string, 0, size),
            ...slices(
                slice(string, size, subtract(length(string), size)),
                size,
            ),
        ]

export const some = <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
): boolean => array.some(predicate)

export const sort = <T>(
    array: T[],
    compare: (left: T, right: T) => number = (left, right) =>
        isLess(left, right) ? -1
        : isGreater(right, left) ? 1
        : 0,
): T[] => array.toSorted(compare)

export const south = ({ c, r }: Position): Position => ({ c, r: add(r, 1) })

export const southEast = (position: Position): Position => south(east(position))

export const southWest = (position: Position): Position => south(west(position))

export const split = (string: string, separator: RegExp | string): string[] =>
    string.split(separator)

export const subset = <T>(array: T[], start: number, size: number): T[] =>
    array.slice(start, start + size)

export const subsets = <T>(array: T[], size: number): T[][] =>
    isLessEqual(length(array), size) ?
        [array]
    :   [
            subset(array, 0, size),
            ...subsets(
                subset(array, size, subtract(length(array), size)),
                size,
            ),
        ]

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

export const string = <T extends number | string>(value: T | T[]): string =>
    Array.isArray(value) ? join(value) : String(value)

export const stringify = (...arguments_: unknown[]): string =>
    JSON.stringify(arguments_)

export const subtract = (left: number, right: number): number => left - right

export const sum = (numbers: number[]): number => reduce(numbers, add, 0)

export const tail = <T>(array: T[]): T[] => without(array, 0)

export const trim = (string: string): string => string.trim()

export const unique = <T>(
    array: T[],
    hash: (value: T, index: number, array: T[]) => string = String,
): T[] => {
    const lookup = fromEntries(
        map(array, (value, index) => [hash(value, index, array), value]),
    )

    return map([...new Set(map(array, hash))], λ(property, lookup))
}

export const until = <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
): T[] => {
    const index = findIndex(array, predicate)
    return isEqual(index, -1) ? array : subset(array, 0, index)
}

export const values = <T>(
    ...arguments_: Parameters<typeof Object.values<T>>
): T[] => Object.values(...arguments_)

export const west = ({ c, r }: Position): Position => ({ c: subtract(c, 1), r })

export const without = <T>(array: T[], index: number): T[] => [
    ...subset(array, 0, index),
    ...subset(array, add(index, 1), subtract(length(array), 1)),
]
