import * as U from "@/utils"

const parse = (input: string): { amount: number; value: string }[] =>
    [...input.trim()].map(Number).map((amount, index) => ({
        amount,
        value: U.even(index) ? String(index / 2) : ".",
    }))

const expand = (
    data: { amount: number; value: string }[],
): { amount: number; value: string }[] =>
    data.flatMap(({ amount, value }) =>
        Array.from({ length: amount }, U.always({ amount: 1, value })),
    )

const move = (
    data: { amount: number; value: string }[],
): { amount: number; value: string }[] => {
    const firstGapIndex = data.findIndex(({ value }) => value === ".")
    const lastNumberIndex = data.findLastIndex(({ value }) => value !== ".")

    if (firstGapIndex > lastNumberIndex) return data

    const firstGap = U.at(data, firstGapIndex)
    const lastNumber = U.at(data, lastNumberIndex)

    data[firstGapIndex] = lastNumber // eslint-disable-line functional/immutable-data, functional/no-expression-statements
    data[lastNumberIndex] = firstGap // eslint-disable-line functional/immutable-data, functional/no-expression-statements

    return move(data)
}

const chunkedMove = (
    data: { amount: number; value: string }[],
    currentIndex = data.length - 1,
): { amount: number; value: string }[] => {
    const current = U.at(data, currentIndex)
    const availableGapIndex = data.findIndex(
        ({ amount, value }) => value === "." && amount >= current.amount,
    )

    const firstGapIndex = data.findIndex(({ value }) => value === ".")

    if (firstGapIndex >= currentIndex) return data

    if (
        availableGapIndex > currentIndex ||
        availableGapIndex === -1 ||
        current.value === "."
    )
        return chunkedMove(data, currentIndex - 1)

    const availableGap = U.at(data, availableGapIndex)

    const nextData = data.flatMap((item, index) =>
        index === availableGapIndex ?
            [
                current,
                {
                    ...availableGap,
                    amount: availableGap.amount - current.amount,
                },
            ]
        : index === currentIndex ? { ...availableGap, amount: current.amount }
        : item,
    )

    return chunkedMove(nextData, currentIndex - 1)
}

const checksum = (data: { amount: number; value: string }[]): number =>
    U.sum(
        data.map(
            ({ value }, index) => index * (value === "." ? 0 : Number(value)),
        ),
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number =>
    checksum(move(expand(parse(input))))

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    checksum(expand(chunkedMove(parse(input))))
