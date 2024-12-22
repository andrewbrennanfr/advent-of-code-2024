import { at, unique } from "@/array"
import { mutateArray, mutateObject } from "@/mutation"
import { isDefined } from "@/utils"

const parse = (input: string): bigint[] => input.trim().split("\n").map(BigInt)

const mix = (left: bigint, right: bigint): bigint => left ^ right // eslint-disable-line no-bitwise

const prune = (number: bigint): bigint => number % 16_777_216n

const generateNextNumber = (number: bigint, times: bigint): bigint => {
    if (times === 0n) return number

    const multiBy64 = number * 64n
    const firstMix = mix(number, multiBy64)
    const firstPrune = prune(firstMix)

    const divBy32 = firstPrune / 32n
    const secondMix = mix(firstPrune, divBy32)
    const secondPrune = prune(secondMix)

    const multiBy2048 = secondPrune * 2048n
    const thirdMix = mix(secondPrune, multiBy2048)
    const thirdPrune = prune(thirdMix)

    return generateNextNumber(thirdPrune, times - 1n)
}

const getPrices = (
    number: bigint,
    times: bigint,
    result: bigint[] = [],
): bigint[] => {
    if (times === 0n) return result

    return getPrices(
        generateNextNumber(number, 1n),
        times - 1n,
        mutateArray(result, [[result.length, number % 10n]]),
    )
}

const getPriceChanges = (prices: bigint[]): bigint[] =>
    prices.reduce<bigint[]>(
        (sequences, number, index) =>
            index === 0 ? sequences : (
                mutateArray(sequences, [
                    [index - 1, number - at(prices, index - 1)],
                ])
            ),
        [],
    )

const getPossiblePriceChanges = (
    priceChanges: bigint[],
    prices: bigint[],
): Record<string, number> =>
    priceChanges.reduce<Record<string, number>>(
        (possiblePriceChanges, priceChange, index) => {
            if (index < 3) return possiblePriceChanges

            const oneBelow = at(priceChanges, index - 1)
            const twoBelow = at(priceChanges, index - 2)
            const threeBelow = at(priceChanges, index - 3)

            const key = [threeBelow, twoBelow, oneBelow, priceChange].join(",")

            if (isDefined(possiblePriceChanges[key]))
                return possiblePriceChanges

            const price = at(prices, index + 1)

            return mutateObject(possiblePriceChanges, [[key, Number(price)]])
        },
        {},
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): bigint => {
    const initialNumbers = parse(input)

    const outputNumbers = initialNumbers.map((number) =>
        generateNextNumber(number, 2000n),
    )

    return outputNumbers.reduce((left, right) => left + right, 0n)
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const initialNumbers = parse(input)

    const priceLists = initialNumbers.map((number) => getPrices(number, 2001n))
    const priceChangeLists = priceLists.map(getPriceChanges)

    const possiblePriceChangeLists = priceChangeLists.map(
        (priceChanges, index) =>
            getPossiblePriceChanges(priceChanges, at(priceLists, index)),
    )

    const possibleKeys = unique(
        possiblePriceChangeLists.flatMap((possiblePriceChanges) =>
            Object.keys(possiblePriceChanges),
        ),
    )

    const possibleValues = possibleKeys.map((key) =>
        possiblePriceChangeLists.reduce(
            (left, list) => left + (list[key] ?? 0),
            0,
        ),
    )

    const maxValue = Math.max(...possibleValues)

    return maxValue
}
