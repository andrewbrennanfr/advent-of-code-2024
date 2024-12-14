import { mutateMap } from "@/mutation"

export const always =
    <T>(value: T): (() => T) =>
    // eslint-disable-next-line functional/functional-parameters
    () =>
        value

export const isDefined = <T>(value: T): value is NonNullable<T> =>
    value !== null && value !== undefined // eslint-disable-line no-undefined

export const makeHash = (...values: (number | string)[]): string =>
    values.join("_")

export const memoize =
    <T extends unknown[], U>(
        function_: (...arguments_: T) => U,
        hash: (arguments_: T) => string = (arguments_) => {
            const hashableArguments = arguments_.map((argument) => {
                if (typeof argument === "function") return argument.name

                return argument
            })

            return JSON.stringify(hashableArguments)
        },
        cache: Map<string, U> = new Map(),
    ): typeof function_ =>
    (...arguments_) => {
        const hashKey = hash(arguments_)

        if (cache.has(hashKey)) return safe(cache.get(hashKey))

        const result = function_(...arguments_)

        mutateMap(cache, [[hashKey, result]]) // eslint-disable-line functional/no-expression-statements

        return result
    }

export const panic = (message: string): never => {
    throw new Error(message) // eslint-disable-line functional/no-throw-statements
}

export const safe = <T>(value: T): NonNullable<T> => {
    if (isDefined(value)) return value

    return panic(`Unsafe value found: ${String(value)}`)
}
