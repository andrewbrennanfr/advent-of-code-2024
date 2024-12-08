/** Partially applies arguments to a function, returning a new function with the remaining arguments. */
export const λ =
    <T extends unknown[], U extends unknown[], V>(
        function_: (...arguments_: [...T, ...U]) => V,
        ...partial: T
    ): ((...remaining: U) => V) =>
    (...remaining) =>
        function_(...partial, ...remaining)

/** Caches the results of a function based on a hash of its arguments. */
export const $ =
    <T extends unknown[], U>(
        function_: (...arguments_: T) => U,
        hash: (arguments_: T) => string = (arguments_) =>
            JSON.stringify(
                arguments_.map((argument) =>
                    typeof argument === "function" && argument.name ?
                        argument.name
                    :   argument,
                ),
            ),
        cache: Record<string, U> = {},
    ): typeof function_ =>
    (...arguments_) =>
        (cache[hash(arguments_)] ??= function_(...arguments_)) // eslint-disable-line functional/immutable-data

/** Returns true if a value is defined. */
export const _ = <T>(value: T): value is NonNullable<T> =>
    value !== null && value !== undefined // eslint-disable-line no-undefined

/** Returns the sum of two numbers. */
export const add = (left: number, right: number): number => left + right

/** Returns the given value as-is. */
export const always =
    <T>(value: T): (() => T) =>
    // eslint-disable-next-line functional/functional-parameters
    () =>
        value

/** Applies a function to a given list of arguments. */
export const apply = <T, U>(
    arguments_: T[],
    function_: (...arguments_: T[]) => U,
): U => function_(...arguments_)

/** Returns true if an array of numbers is sorted in ascending order. */
export const ascending = (numbers: number[]): boolean =>
    follows(numbers, (left, right) => left >= right)

/** Retrieves a value from an array or throws an error if the value is not defined. */
export const at = <T>(index: number, array: T[]): NonNullable<T> =>
    guard(array[(index + array.length) % array.length])

/** Returns true if a number is inclusively between two other numbers. */
export const between = (left: number, number: number, right: number): boolean =>
    (left <= number && number <= right) || (right <= number && number <= left)

/** Returns the value at a specific position in a 2D grid. */
export const cell = <T>(
    grid: T[][],
    { c, r }: Record<"c" | "r", number>,
): T | undefined => grid[r]?.[c]

/** Rotates a 2D array clockwise by a specified degree. */
export const clockwise = <T>(
    [first = [], ...grid]: T[][],
    degrees = 90,
): T[][] =>
    degrees <= 0 ?
        [first, ...grid]
    :   clockwise(
            first.map((cell, index) =>
                [cell, ...grid.map(λ(at, index))].toReversed(),
            ),
            degrees - 90,
        )

/** Combines arrays by applying a function to elements at each index. */
export const converge = <T>(
    arrays: T[][],
    combine: (left: T, right: T, arrays: [T[], T[]]) => T,
): T[] =>
    arrays.reduce((left, right) =>
        left.map((__, index) =>
            combine(at(index, left), at(index, right), [left, right]),
        ),
    )

/** Counts the number of values in an array that satisfy a given condition. */
export const count = <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
): number => array.filter(predicate).length

/** Returns the diagonal positions relative to a 2D grid position. */
export const cousins = (
    position: Record<"c" | "r", number>,
): Record<
    "northEast" | "northWest" | "southEast" | "southWest",
    Record<"c" | "r", number>
> => ({
    northEast: northEast(position),
    northWest: northWest(position),
    southEast: southEast(position),
    southWest: southWest(position),
})

/** Returns true if an array of numbers is sorted in descending order. */
export const descending = (numbers: number[]): boolean =>
    ascending(numbers.toReversed())

/** Returns the absolute difference between two numbers. */
export const distance = (left: number, right: number): number =>
    Math.abs(left - right)

/** Returns the position east of the given position. */
export const east = ({
    c,
    r,
}: Record<"c" | "r", number>): Record<"c" | "r", number> => ({ c: c + 1, r })

/** Returns true if each value in an array satisfies a predicate with its predecessor. */
export const follows = <T>(
    array: T[],
    predicate: (left: T, right: T) => boolean,
): boolean =>
    array.every(
        (value, index) => index === 0 || predicate(at(index - 1, array), value),
    )

/** Generates a 2D grid from a string. */
export const grid = (
    string: string,
    separator: RegExp | string = "",
): string[][] => lines(string).map((line) => line.split(separator))

/** Ensures a value is not null or undefined, throwing an error if the check fails. */
export const guard = <T>(value: T): NonNullable<T> =>
    _(value) ? value : panic(`${String(value)} did not pass guard!`)

/** Checks if an array contains a specific value. */
export const included = <T>(array: T[], value: T): boolean =>
    array.includes(value)

/** Checks if a value is present in an array. */
export const includes = <T>(value: T, array: T[]): boolean =>
    included(array, value)

/** Returns the second argument, ignoring the first. */
export const index = <T>(_: unknown, index: T): T => index

/** Splits a string into an array of trimmed lines. */
export const lines = (string: string): string[] => string.trim().split("\n")

/** Maps each cell of a 2D grid to a new value using a function. */
export const map2D = <T, U>(
    grid: T[][],
    iteratee: (cell: T, position: Record<"c" | "r", number>, grid: T[][]) => U,
): U[][] =>
    grid.map((row, r) => row.map((cell, c) => iteratee(cell, { c, r }, grid)))

/** Returns all matches of a regex in a string as an array. */
export const match = (
    string: string,
    regex: RegExp,
): (Omit<RegExpExecArray, "groups"> &
    Required<Pick<RegExpExecArray, "groups">>)[] =>
    [...string.matchAll(regex)].map(({ groups, ...match }) => ({
        ...match,
        groups: { ...groups },
    }))

/** Returns the middle element of an array. If the array has an even length, it returns the element at the lower middle index. */
export const middle = <T>(array: T[]): T => at((array.length - 1) / 2, array)

/** Returns the product of two numbers. */
export const multiply = (left: number, right: number): number => left * right

/** Returns the position north of the given position. */
export const north = ({
    c,
    r,
}: Record<"c" | "r", number>): Record<"c" | "r", number> => ({ c, r: r - 1 })

/** Returns the position northeast of the given position. */
export const northEast = (
    position: Record<"c" | "r", number>,
): Record<"c" | "r", number> => north(east(position))

/** Returns the position northwest of the given position. */
export const northWest = (
    position: Record<"c" | "r", number>,
): Record<"c" | "r", number> => north(west(position))

/** Returns a function that negates the result of the provided predicate. */
export const not =
    <T extends unknown[]>(
        predicate: (...arguments_: T) => boolean,
    ): ((...arguments_: T) => boolean) =>
    (...arguments_) =>
        !predicate(...arguments_)

/** Throws an error with the specified message. */
export const panic = (message: string): never => {
    throw new Error(message) // eslint-disable-line functional/no-throw-statements
}

/** Generates a sequence of positions in a given direction. */
export const path = $(
    (
        start: Record<"c" | "r", number>,
        direction: (
            position: Record<"c" | "r", number>,
        ) => Record<"c" | "r", number>,
        moves: number,
    ): Record<"c" | "r", number>[] =>
        moves === 0 ?
            [start]
        :   [start, ...path(direction(start), direction, moves - 1)],
)

/** Produces an array by applying a function to each pair of elements. */
export const produce = <T>(
    array: T[],
    combine: (left: T, right: T, index: number) => T[],
): T[] =>
    array.reduce<T[]>(
        (left, right) =>
            left.length === 0 ?
                [right]
            :   left.flatMap((value, index) => combine(value, right, index)),
        [],
    )

/** Returns the product of all numbers in an array. */
export const product = (numbers: number[]): number =>
    numbers.reduce(multiply, Number(numbers.length > 0))

/** Returns the adjacent positions of a given position in a 2D grid. */
export const siblings = (
    position: Record<"c" | "r", number>,
): Record<"east" | "north" | "south" | "west", Record<"c" | "r", number>> => ({
    east: east(position),
    north: north(position),
    south: south(position),
    west: west(position),
})

/** Extracts a portion of an array between specified start and end indices. */
export const subset = <T>(start: number, end: number, array: T[]): T[] =>
    array.slice(start, end)

/** Extracts a portion of a string between specified start and end indices. */
export const substring = (start: number, end: number, string: string): string =>
    string.slice(start, end)

/** Sorts an array using a comparison function. */
export const sort = <T>(
    array: T[],
    compare: (left: T, right: T) => number = (left, right) =>
        left < right ? -1
        : right > left ? 1
        : 0,
): T[] => array.toSorted(compare)

/** Returns the position south of the given position. */
export const south = ({
    c,
    r,
}: Record<"c" | "r", number>): Record<"c" | "r", number> => ({ c, r: r + 1 })

/** Returns the position southeast of the given position. */
export const southEast = (
    position: Record<"c" | "r", number>,
): Record<"c" | "r", number> => south(east(position))

/** Returns the position southwest of the given position. */
export const southWest = (
    position: Record<"c" | "r", number>,
): Record<"c" | "r", number> => south(west(position))

/** Concatenates an array of strings into a single string without any separator. */
export const string = <T extends number | string>(values: T[]): string =>
    values.join("")

/** Returns the sum of all numbers in an array. */
export const sum = (numbers: number[]): number => numbers.reduce(add, 0)

/** Returns all surrounding positions for a given 2D grid position. */
export const surrounding = (
    position: Record<"c" | "r", number>,
): Record<
    | "east"
    | "north"
    | "northEast"
    | "northWest"
    | "south"
    | "southEast"
    | "southWest"
    | "west",
    Record<"c" | "r", number>
> => ({ ...cousins(position), ...siblings(position) })

/** Extracts a portion of an array up to the first element that satisfies a predicate. */
export const until = <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
): T[] => {
    const index = array.findIndex(predicate)
    return index === -1 ? array : subset(0, index, array)
}

/** Returns a new array containing only the unique values based on a hash. */
export const unique = <T>(
    array: T[],
    hash: (value: T, index: number, array: T[]) => string = String,
): T[] => {
    const lookup = Object.fromEntries(
        array.map((value, index) => [hash(value, index, array), value]),
    )

    return [...new Set(array.map(hash))].map((hash) => guard(lookup[hash]))
}

/** Returns the position west of the given position. */
export const west = ({
    c,
    r,
}: Record<"c" | "r", number>): Record<"c" | "r", number> => ({ c: c - 1, r })

/** Removes the value at the specified index from an array. */
export const without = <T>(array: T[], index: number): T[] => [
    ...subset(0, index, array),
    ...subset(index + 1, array.length, array),
]
