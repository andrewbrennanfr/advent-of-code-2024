/** Memoizes a function by caching results based on a hash of its arguments. */
export const $ =
    <T extends unknown[], U>(
        function_: (...arguments_: T) => U,
        hash: (arguments_: T) => string = JSON.stringify,
        cache: Record<string, U> = {},
    ): typeof function_ =>
    (...arguments_) =>
        (cache[hash(arguments_)] ??= function_(...arguments_)) // eslint-disable-line functional/immutable-data

/** Splits a string into an array of lines. */
export const lines = (string: string): string[] => string.trim().split("\n")
