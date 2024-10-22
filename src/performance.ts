export const measure = (): (() => number) => {
    const start = performance.now()

    return () => {
        const end = performance.now()
        const duration = end - start

        return duration
    }
}

export const memoize = <
    T extends [unknown, ...unknown[]],
    U extends NonNullable<unknown> | null,
>(
    fn: (...args: T) => U,
    hash: (args: T) => string,
): ((...args: T) => U) => {
    const map = new Map<string, U>()

    return (...args) => {
        const key = hash(args)
        const value = map.get(key)
        const result = typeof value === "undefined" ? fn(...args) : value

        // eslint-disable-next-line no-restricted-syntax -- Mutation is permitted here, as this makes memoization possible.
        map.set(key, result)

        return result
    }
}
