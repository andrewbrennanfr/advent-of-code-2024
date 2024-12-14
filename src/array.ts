import { safe } from "@/utils"

export const at = <T>(array: T[], index: number): NonNullable<T> =>
    safe(array.at(index))

export const count = <T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
): number => array.filter(predicate).length

export const order = <T>(array: T[]): T[] =>
    array.toSorted((left, right) => {
        if (left < right) return -1

        if (right > left) return 1

        return 0
    })

export const unique = <T>(
    array: T[],
    hash: (value: T, index: number, array: T[]) => string = String,
): T[] => {
    const hashMap = Object.fromEntries(
        array.map((value, index) => {
            const hashMapKey = hash(value, index, array)

            return [hashMapKey, value]
        }),
    )
    const hashMapKeys = new Set(Object.keys(hashMap))

    return [...hashMapKeys].map((hashMapKey) => safe(hashMap[hashMapKey]))
}
