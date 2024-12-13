import { at } from "@/array"
import { mutateArray } from "@/mutation"
import { isEven, sum } from "@/number"
import { always } from "@/utils"

const parse = (input: string): { amount: number; value: string }[] => {
    const numbers = [...input.trim()].map(Number)

    return numbers.map((amount, index) => ({
        amount,
        value: isEven(index) ? String(index / 2) : ".",
    }))
}

const expand = (
    data: { amount: number; value: string }[],
): { amount: number; value: string }[] =>
    data.flatMap(({ amount, value }) =>
        Array.from({ length: amount }, always({ amount: 1, value })),
    )

const move = (
    data: { amount: number; value: string }[],
): { amount: number; value: string }[] => {
    const firstGapIndex = data.findIndex(({ value }) => value === ".")
    const lastNumberIndex = data.findLastIndex(({ value }) => value !== ".")

    if (firstGapIndex > lastNumberIndex) return data

    const firstGap = at(data, firstGapIndex)
    const lastNumber = at(data, lastNumberIndex)

    const nextData = mutateArray(data, [
        [firstGapIndex, lastNumber],
        [lastNumberIndex, firstGap],
    ])

    return move(nextData)
}

const chunkedMove = (
    data: { amount: number; value: string }[],
    currentIndex: number,
): { amount: number; value: string }[] => {
    const firstGapIndex = data.findIndex(({ value }) => value === ".")

    if (firstGapIndex >= currentIndex) return data

    const current = at(data, currentIndex)
    const availableGapIndex = data.findIndex(
        ({ amount, value }) => value === "." && amount >= current.amount,
    )

    if (
        availableGapIndex > currentIndex ||
        availableGapIndex === -1 ||
        current.value === "."
    )
        return chunkedMove(data, currentIndex - 1)

    const availableGap = at(data, availableGapIndex)

    const nextData = data.flatMap((item, index) => {
        if (index === availableGapIndex) {
            const remainingGap = {
                ...availableGap,
                amount: availableGap.amount - current.amount,
            }

            if (remainingGap.amount > 0) return [current, remainingGap]

            return current
        }

        if (index === currentIndex)
            return { ...availableGap, amount: current.amount }

        return item
    })

    return chunkedMove(nextData, currentIndex - 1)
}

const evaluate = (data: { amount: number; value: string }[]): number => {
    const numbers = data.map(
        ({ value }, index) => index * (value === "." ? 0 : Number(value)),
    )

    return sum(numbers)
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const data = parse(input)
    const expandedData = expand(data)
    const movedData = move(expandedData)

    return evaluate(movedData)
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const data = parse(input)
    const movedData = chunkedMove(data, data.length - 1)
    const expandedData = expand(movedData)

    return evaluate(expandedData)
}
