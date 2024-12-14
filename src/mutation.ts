export const mutateArray = <T>(array: T[], mutations: [number, T][]): T[] =>
    mutations.reduce((currentArray, [index, value]) => {
        // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
        currentArray[index] = value

        return currentArray
    }, array)

export const mutateMap = <T, U>(
    map: Map<T, U>,
    mutations: [T, U][],
): Map<T, U> =>
    mutations.reduce(
        (currentMap, [key, value]) =>
            // eslint-disable-next-line no-restricted-syntax
            currentMap.set(key, value),
        map,
    )

export const mutateObject = <T>(
    object: Record<string, T>,
    mutations: [string, T][],
): Record<string, T> =>
    mutations.reduce((currentObject, [key, value]) => {
        // eslint-disable-next-line functional/immutable-data, functional/no-expression-statements
        currentObject[key] = value

        return currentObject
    }, object)

export const mutateSet = <T>(set: Set<T>, mutations: T[]): Set<T> =>
    mutations.reduce(
        (currentSet, value) =>
            // eslint-disable-next-line no-restricted-syntax
            currentSet.add(value),
        set,
    )
