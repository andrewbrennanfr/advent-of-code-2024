import { safe } from "@/utils"

export const at = <T>(array: T[], index: number): NonNullable<T> =>
    safe(unsafeAt(array, index))

export const count = <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
): number => array.filter(predicate).length

export const order = <T>(array: T[]): T[] =>
    array.toSorted((left, right) =>
        left < right ? -1
        : right > left ? 1
        : 0,
    )

export const unique = <T>(
    array: T[],
    hash: (value: T, index: number, array: T[]) => string = String,
): T[] => {
    const hashMap = Object.fromEntries(
        array.map((value, index) => [hash(value, index, array), value]),
    )
    const hashes = new Set(Object.keys(hashMap))

    return [...hashes].map((hash) => safe(hashMap[hash]))
}

export const unsafeAt = <T>(array: T[], index: number): T | undefined =>
    array.at(index)
