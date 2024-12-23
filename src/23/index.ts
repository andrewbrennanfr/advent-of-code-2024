import { at, order, unique } from "@/array"
import { makeGrid } from "@/grid"
import { mutateObject } from "@/mutation"
import { isDefined, makeHash, memoize, safe } from "@/utils"

const parse = (input: string): Record<"left" | "right", string>[] =>
    makeGrid(input, "-")
        .map(order)
        .map(([left, right]) => ({ left: safe(left), right: safe(right) }))

const makeLookup = (
    data: Record<"left" | "right", string>[],
): Record<string, string[]> =>
    data.reduce<Record<string, string[]>>((currentLookup, { left, right }) => {
        const existingLeft = currentLookup[left] ?? []
        const existingRight = currentLookup[right] ?? []

        return mutateObject(currentLookup, [
            [left, order([...existingLeft, right])],
            [right, order([...existingRight, left])],
        ])
    }, {})

const isLan = (
    lookup: Record<string, string[]>,
    connections: string[],
): boolean =>
    unique(connections).length === connections.length &&
    connections.every((connection) => {
        const connectedTo = safe(lookup[connection])

        return connections.every(
            (otherConnection) =>
                otherConnection === connection ||
                connectedTo.includes(otherConnection),
        )
    })

const dedupe = (connectionLists: string[][]): string[][] =>
    unique(connectionLists, (connections) => makeHash(...order(connections)))

const getCombinations = memoize((list: string[], size: number): string[][] => {
    if (size === 0) return [[]]

    return list.flatMap((item, index) =>
        getCombinations(list.slice(index + 1), size - 1).map((combination) => [
            item,
            ...combination,
        ]),
    )
})

const findLan = (
    lookup: Record<string, string[]>,
    key: string,
    minSize: number,
): string[] => {
    const connections = safe(lookup[key])

    const possibleSizes = Array.from(
        { length: connections.length - minSize },
        (__, index) => minSize + index + 1,
    )

    const list = [key, ...connections]

    if (possibleSizes.length === 0) return []

    const firstNonLanSize = possibleSizes.find(
        (possibleSize) =>
            !getCombinations(list, possibleSize).some((combination) =>
                isLan(lookup, combination),
            ),
    )

    if (firstNonLanSize === 0) return []

    if (!isDefined(firstNonLanSize))
        return safe(
            getCombinations(list, at(possibleSizes, -1)).find((combination) =>
                isLan(lookup, combination),
            ),
        )

    return safe(
        getCombinations(list, firstNonLanSize - 1).find((combination) =>
            isLan(lookup, combination),
        ),
    )
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const data = parse(input)
    const lookup = makeLookup(data)

    const lans = Object.entries(lookup)
        .flatMap(([key, value]) => getCombinations([key, ...value], 3))
        .filter((combination) => isLan(lookup, combination))

    const lansWithT = lans.filter((connections) =>
        connections.some((connection) => connection.startsWith("t")),
    )

    const uniqueLoops = dedupe(lansWithT)

    return uniqueLoops.length
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): string => {
    const data = parse(input)
    const lookup = makeLookup(data)

    const biggestLan = Object.keys(lookup).reduce(
        (currentBiggestLan, key) => {
            const nextBiggestLan = findLan(
                lookup,
                key,
                currentBiggestLan.length,
            )

            if (nextBiggestLan.length > currentBiggestLan.length)
                return nextBiggestLan

            return currentBiggestLan
        },
        [""],
    )

    return order(biggestLan).join(",")
}
