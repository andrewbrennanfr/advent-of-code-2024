import { sum } from "@/number"
import { memoize, safe } from "@/utils"

/* eslint-disable */
const NUMBER_MAPPING: Record<string, Record<string, string>> = {
    "7": {
        "7": "A",
        "8": ">A",
        "9": ">>A",

        "4": "vA",
        "5": "v>A",
        "6": "v>>A",

        "1": "vvA",
        "2": "vv>A",
        "3": "vv>>A",

        "0": ">vvvA",
        A: ">>vvvA",
    },

    "8": {
        "7": "<A",
        "8": "A",
        "9": ">A",

        "4": "v<A",
        "5": "vA",
        "6": "v>A",

        "1": "vv<A",
        "2": "vvA",
        "3": "vv>A",

        "0": "vvvA",
        A: "vvv>A",
    },

    "9": {
        "7": "<<A",
        "8": "<A",
        "9": "A",

        "4": "v<<A",
        "5": "v<A",
        "6": "vA",

        "1": "vv<<A",
        "2": "vv<A",
        "3": "vvA",

        "0": "<vvvA",
        A: "vvvA",
    },

    "4": {
        "7": "^A",
        "8": "^>A",
        "9": ">>^A",

        "4": "A",
        "5": ">A",
        "6": ">>A",

        "1": "vA",
        "2": ">vA",
        "3": ">>vA",

        "0": ">vvA",
        A: ">>vvA",
    },

    "5": {
        "7": "^<A",
        "8": "^A",
        "9": "^>A",

        "4": "<A",
        "5": "A",
        "6": ">A",

        "1": "v<A",
        "2": "vA",
        "3": "v>A",

        "0": "vvA",
        A: ">vvA",
    },

    "6": {
        "7": "^<<A",
        "8": "<^A",
        "9": "^A",

        "4": "<<A",
        "5": "<A",
        "6": "A",

        "1": "v<<A",
        "2": "v<A",
        "3": "vA",

        "0": "vv<A",
        A: "vvA",
    },

    "1": {
        "7": "^^A",
        "8": "^^>A",
        "9": ">>^^A",

        "4": "^A",
        "5": "^>A",
        "6": ">>^A",

        "1": "A",
        "2": ">A",
        "3": ">>A",

        "0": ">vA",
        A: ">>vA",
    },

    "2": {
        "7": "^^<A",
        "8": "^^A",
        "9": "^^>A",

        "4": "^<A",
        "5": "^A",
        "6": "^>A",

        "1": "<A",
        "2": "A",
        "3": ">A",

        "0": "vA",
        A: "v>A",
    },

    "3": {
        "7": "<<^^A",
        "8": "^^<A",
        "9": "^^A",

        "4": "<<^A",
        "5": "<^A",
        "6": "^A",

        "1": "<<A",
        "2": "<A",
        "3": "A",

        "0": "<vA",
        A: "vA",
    },

    "0": {
        "7": "^^^<A",
        "8": "^^^A",
        "9": ">^^^A",

        "4": "^^<A",
        "5": "^^A",
        "6": ">^^A",

        "1": "^<A",
        "2": "^A",
        "3": ">^A",

        "0": "A",
        A: ">A",
    },

    A: {
        "7": "^^^<<A",
        "8": "<^^^A",
        "9": "^^^A",

        "4": "^^<<A",
        "5": "^^<A",
        "6": "^^A",

        "1": "^<<A",
        "2": "^<A",
        "3": "^A",

        "0": "<A",
        A: "A",
    },
}

const ARROW_MAPPING: Record<string, Record<string, string>> = {
    A: {
        A: "A",
        "^": "<A",

        "<": "v<<A",
        v: "<vA",
        ">": "vA",
    },

    "^": {
        A: ">A",
        "^": "A",

        "<": "v<A",
        v: "vA",
        ">": "v>A",
    },

    "<": {
        A: ">>^A",
        "^": ">^A",

        "<": "A",
        v: ">A",
        ">": ">>A",
    },

    v: {
        A: "^>A",
        "^": "^A",

        "<": "<A",
        v: "A",
        ">": ">A",
    },

    ">": {
        A: "^A",
        "^": "<^A",

        "<": "<<A",
        v: "<A",
        ">": "A",
    },
}
/* eslint-enable */

const parse = (input: string): string[] => input.trim().split("\n")

const getShortestNumberSequence = (
    code: string,
    current: string,
    times: number,
): number => {
    const target = safe(code.at(0))

    if (code.length === 1) {
        const mapping = safe(safe(NUMBER_MAPPING[current])[target])

        return getShortestDirectionSequence(mapping, "A", times)
    }

    return (
        getShortestNumberSequence(target, current, times) +
        getShortestNumberSequence(code.slice(1), target, times)
    )
}

const getShortestDirectionSequence = memoize(
    (code: string, current: string, times: number): number => {
        const target = safe(code.at(0))

        if (code.length === 1) {
            const mapping = safe(safe(ARROW_MAPPING[current])[target])
            const nextStep = (
                times === 2 ? getDirectionSequence : (
                    getShortestDirectionSequence
                ))(mapping, "A", times - 1)

            return nextStep
        }

        return (
            getShortestDirectionSequence(target, current, times) +
            getShortestDirectionSequence(code.slice(1), target, times)
        )
    },
)

const getDirectionSequence = (code: string, current: string): number => {
    const target = safe(code.at(0))

    if (code.length === 1)
        return safe(safe(ARROW_MAPPING[current])[target]).length

    return (
        getDirectionSequence(target, current) +
        getDirectionSequence(code.slice(1), target)
    )
}

const getCompleteSequence = (
    code: string,
    current: string,
    times: number,
): number => {
    const numberSequence = getShortestNumberSequence(code, current, times)

    return numberSequence
}

const evaluate = (results: { code: string; sequence: number }[]): number =>
    sum(
        results.map(
            ({ code, sequence }) =>
                sequence * Number.parseInt(code.slice(0, -1), 10),
        ),
    )

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const codes = parse(input)
    const results = codes.map((code) => ({
        code,
        sequence: getCompleteSequence(code, "A", 2),
    }))

    return evaluate(results)
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const codes = parse(input)
    const results = codes.map((code) => ({
        code,
        sequence: getCompleteSequence(code, "A", 25),
    }))

    return evaluate(results)
}
