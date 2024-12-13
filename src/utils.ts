export const always =
    <T>(value: T): (() => T) =>
    // eslint-disable-next-line functional/functional-parameters
    () =>
        value

export const hash = (...values: (number | string)[]): string => values.join("_")

export const isDefined = <T>(value: T): value is NonNullable<T> =>
    value !== null && value !== undefined // eslint-disable-line no-undefined

export const memo =
    <T extends unknown[], U>(
        function_: (...arguments_: T) => U,
        getHash: (arguments_: T) => string = (arguments_) =>
            JSON.stringify(
                arguments_.map((argument) =>
                    typeof argument === "function" ? argument.name : argument,
                ),
            ),
        cache: Record<string, U> = {},
    ): typeof function_ =>
    (...arguments_) =>
        (cache[getHash(arguments_)] ??= function_(...arguments_)) // eslint-disable-line functional/immutable-data

export const panic = (message: string): never => {
    throw new Error(message) // eslint-disable-line functional/no-throw-statements
}

export const safe = <T>(value: T): NonNullable<T> =>
    isDefined(value) ? value : panic(`Unsafe value found: ${String(value)}`)
