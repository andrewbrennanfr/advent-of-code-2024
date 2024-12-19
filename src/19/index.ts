import { at, count } from "@/array"
import { sum } from "@/number"
import { memoize } from "@/utils"

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
    (design: string, patterns: string[]): number => {
        if (design.length === 0) return 1

        const possibleNext = patterns.filter((pattern) =>
            design.startsWith(pattern),
        )

        if (possibleNext.length === 0) return 0

        return sum(
            possibleNext.map((next) =>
                countCombinations(design.slice(next.length), patterns),
            ),
        )
    },
)

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const { designs, patterns } = parse(input)

    return count(designs, (design) => countCombinations(design, patterns) > 0)
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const { designs, patterns } = parse(input)

    const counts = designs.map((design) => countCombinations(design, patterns))

    return sum(counts)
}
