export const mutateArray = <T>(array: T[], mutations: [number, T][]): T[] =>
    mutations.reduce((array, [index, value]) => {
        // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
        array[index] = value

        return array
    }, array)

export const mutateMap = <T>(
    map: Map<string, T>,
    mutations: [string, T][],
): Map<string, T> =>
    mutations.reduce(
        (map, [key, value]) =>
            // eslint-disable-next-line no-restricted-syntax
            map.set(key, value),
        map,
    )

export const mutateObject = <T>(
    object: Record<string, T>,
    mutations: [string, T][],
): Record<string, T> =>
    mutations.reduce((object, [key, value]) => {
        // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
        object[key] = value

        return object
    }, object)

export const mutateSet = <T>(set: Set<T>, mutations: T[]): Set<T> =>
    mutations.reduce(
        (set, value) =>
            // eslint-disable-next-line no-restricted-syntax
            set.add(value),
        set,
    )
