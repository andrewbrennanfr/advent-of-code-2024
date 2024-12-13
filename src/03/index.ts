import { product, sum } from "@/number"
import { matches } from "@/string"

const parse = (input: string): ReturnType<typeof matches> =>
    matches(input.trim(), /mul\((?<left>\d+),(?<right>\d+)\)/gu)

const evaluate = (muls: ReturnType<typeof matches>): number => {
    const products = muls.map(({ groups }) => {
        const numbers = Object.values(groups).map(Number)

        return product(numbers)
    })

    return sum(products)
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => evaluate(parse(input))

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const muls = parse(input)
    const enabledMuls = muls.filter((mul) => {
        const before = mul.input.slice(0, mul.index)

        return before.lastIndexOf("do()") >= before.lastIndexOf("don't()")
    })

    return evaluate(enabledMuls)
}
