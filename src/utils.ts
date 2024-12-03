/** Memoizes a function by caching results based on a hash of its arguments. */
export const $ =
    <T extends unknown[], U>(
        function_: (...arguments_: T) => U,
        hash: (arguments_: T) => string = JSON.stringify,
        cache: Record<string, U> = {},
    ): typeof function_ =>
    (...arguments_) =>
        (cache[hash(arguments_)] ??= function_(...arguments_)) // eslint-disable-line functional/immutable-data

/** Checks if a value is not undefined. */
export const _ = <T>(value: T | undefined): value is T => value !== undefined // eslint-disable-line no-undefined

/** Checks if an array of numbers is sorted in ascending order. */
export const ascending = (numbers: number[]): boolean =>
    follows(numbers, (left, right) => left >= right)

/** Retrieves an item from a list or throws an error if the index is out of bounds. */
export const at = <T>(list: T[], index: number): T =>
    _(list[index]) ? list[index] : panic(`No item at index: ${index}`)

/** Checks if a number is inclusively between two other numbers. */
export const between = (left: number, number: number, right: number): boolean =>
    (left <= number && right >= number) || (right <= number && left >= number)

/** Rotates a 2D array 90 degrees clockwise. */
export const clockwise = <T>([first = [], ...rest]: T[][]): T[][] =>
    first.map((item, index) =>
        [item, ...rest.map((row) => at(row, index))].toReversed(),
    )

/** Merges arrays by applying a function to combine elements at each index. */
export const converge = <T>(
    lists: T[][],
    combine: (left: T[], right: T[], index: number) => T,
): T[] =>
    lists.reduce((left, right) =>
        left.map((__, index) => combine(left, right, index)),
    )

/** Returns the number of items in a list that satisfy a given predicate. */
export const count = <T>(
    list: T[],
    predicate: (item: T, index: number, list: T[]) => boolean,
): number => list.filter(predicate).length

/** Checks if an array of numbers is sorted in descending order. */
export const descending = (numbers: number[]): boolean =>
    ascending(numbers.toReversed())

/** Calculates the absolute difference between two numbers. */
export const distance = (left: number, right: number): number =>
    Math.abs(left - right)

/** Checks if each item in an array satisfies a predicate when compared to its predecessor. */
export const follows = <T>(
    items: T[],
    predicate: (left: T, right: T) => boolean,
): boolean =>
    items.every(
        (item, index) => index === 0 || predicate(at(items, index - 1), item),
    )

/** Splits a string into an array of lines. */
export const lines = (string: string): string[] => string.trim().split("\n")

/** Returns an array of all regex matches found in a string. */
export const match = (
    string: string,
    regex: RegExp,
): (Omit<RegExpExecArray, "groups"> &
    Required<Pick<RegExpExecArray, "groups">>)[] =>
    [...string.matchAll(regex)].map(({ groups, ...rest }) => ({
        ...rest,
        groups: { ...groups },
    }))

/** Throws an error with the provided message. */
export const panic = (message: string): never => {
    throw new Error(message) // eslint-disable-line functional/no-throw-statements
}

/** Calculates the total product of an array of numbers. */
export const product = (numbers: number[]): number =>
    numbers.reduce((total, number) => total * number, 1)

/** Sorts a list using a custom comparison function. */
export const sort = <T>(
    list: T[],
    compare: (left: T, right: T) => number = (left, right) =>
        left < right ? -1
        : right > left ? 1
        : 0,
): T[] => list.toSorted(compare)

/** Splits a string by one or more spaces. */
export const spaces = (string: string): string[] => string.split(/ +/u)

/** Calculates the total sum of an array of numbers. */
export const sum = (numbers: number[]): number =>
    numbers.reduce((total, number) => total + number, 0)

/** Returns a new array with the item at the specified index removed. */
export const without = <T>(items: T[], index: number): T[] => [
    ...items.slice(0, index),
    ...items.slice(index + 1),
]
