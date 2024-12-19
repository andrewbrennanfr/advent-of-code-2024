import { at, count } from "@/array"
import { sum } from "@/number"
import { makeHash, memoize } from "@/utils"

const parse = (
    input: string,
): {
    designs: string[]
    patterns: string[]
} => {
    const chunks = input.trim().split("\n\n")

    return {
        designs: at(chunks, 1).trim().split("\n"),
        patterns: at(chunks, 0).trim().split(", "),
    }
}

const countCombinations = memoize(
    (design: string, patterns: string[]): number =>
        design.length === 0 ?
            1
        :   sum(
                patterns
                    .filter((pattern) => design.startsWith(pattern))
                    .map((next) =>
                        countCombinations(design.slice(next.length), patterns),
                    ),
            ),
    ([design, patterns]) => makeHash(design, patterns.length),
)

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const { designs, patterns } = parse(input)

    return count(designs, (design) => countCombinations(design, patterns) > 0)
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const { designs, patterns } = parse(input)

    return sum(designs.map((design) => countCombinations(design, patterns)))
}
