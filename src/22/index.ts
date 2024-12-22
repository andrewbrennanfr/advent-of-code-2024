import { at, unique } from "@/array"
import { mutateArray, mutateMap } from "@/mutation"

const parse = (input: string): bigint[] => input.trim().split("\n").map(BigInt)

const mix = (left: bigint, right: bigint): bigint => left ^ right // eslint-disable-line no-bitwise

const prune = (number: bigint): bigint => number % 16_777_216n

const transformNumber = (number: bigint): bigint => {
    const multiBy64 = number * 64n
    const firstMix = mix(number, multiBy64)
    const firstPrune = prune(firstMix)

    const divBy32 = firstPrune / 32n
    const secondMix = mix(firstPrune, divBy32)
    const secondPrune = prune(secondMix)

    const multiBy2048 = secondPrune * 2048n
    const thirdMix = mix(secondPrune, multiBy2048)
    const thirdPrune = prune(thirdMix)

    return thirdPrune
}

const generateNextNumber = (number: bigint, times: number): bigint =>
    times === 0 ? number : (
        generateNextNumber(transformNumber(number), times - 1)
    )

const getPrices = (
    number: bigint,
    times: number,
    result: number[] = [],
): number[] =>
    times === 0 ? result : (
        getPrices(
            generateNextNumber(number, 1),
            times - 1,
            mutateArray(result, [[result.length, Number(number % 10n)]]),
        )
    )

const getPriceChanges = (prices: number[]): number[] =>
    prices.reduce<number[]>(
        (sequences, number, index) =>
            index === 0 ? sequences : (
                mutateArray(sequences, [
                    [index - 1, number - at(prices, index - 1)],
                ])
            ),
        [],
    )

const getPossiblePriceChanges = (
    priceChanges: number[],
    prices: number[],
): Map<string, number> =>
    priceChanges.reduce<Map<string, number>>(
        (possiblePriceChanges, priceChange, index) => {
            if (index < 3) return possiblePriceChanges

            const key = [
                at(priceChanges, index - 1),
                at(priceChanges, index - 2),
                at(priceChanges, index - 3),
                priceChange,
            ].join(",")

            if (possiblePriceChanges.has(key)) return possiblePriceChanges

            return mutateMap(possiblePriceChanges, [
                [key, Number(at(prices, index + 1))],
            ])
        },
        new Map(),
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): bigint => {
    const initialNumbers = parse(input)

    const outputNumbers = initialNumbers.map((number) =>
        generateNextNumber(number, 2000),
    )

    return outputNumbers.reduce((left, right) => left + right, 0n)
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const initialNumbers = parse(input)

    const priceLists = initialNumbers.map((number) => getPrices(number, 2001))
    const priceChangeLists = priceLists.map(getPriceChanges)

    const possiblePriceChangeLists = priceChangeLists.map(
        (priceChanges, index) =>
            getPossiblePriceChanges(priceChanges, at(priceLists, index)),
    )

    const possibleKeys = unique(
        possiblePriceChangeLists.flatMap((possiblePriceChanges) => [
            ...possiblePriceChanges.keys(),
        ]),
    )

    const possibleValues = possibleKeys
        .values()
        .map((key) =>
            possiblePriceChangeLists.reduce(
                (left, list) => left + (list.get(key) ?? 0),
                0,
            ),
        )

    const maxValue = Math.max(...possibleValues)

    return maxValue
}
