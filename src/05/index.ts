import * as U from "@/utils"

const parse = (
    input: string,
): { rules: Record<string, number[]>; updates: number[][] } => {
    const chunks = input.trim().split("\n\n")

    return {
        rules: Object.fromEntries(
            U.map2D(U.grid(U.at(0, chunks), "|"), Number).flatMap((rule) => [
                [String(rule), rule],
                [String(rule.toReversed()), rule],
            ]),
        ),
        updates: U.map2D(U.grid(U.at(1, chunks), ","), Number),
    }
}

const sort = (rules: Record<string, number[]>, update: number[]): number[] =>
    U.sort(update, (left, right) =>
        U.at(0, U.guard(rules[String([left, right])])) === left ? -1 : 1,
    )

const valid = (rules: Record<string, number[]>, update: number[]): boolean =>
    String(sort(rules, update)) === String(update)

const solve = (
    input: string,
    valid: (rules: Record<string, number[]>, update: number[]) => boolean,
): number => {
    const { rules, updates } = parse(input)

    return U.sum(
        updates.filter(U.λ(valid, rules)).map(U.λ(sort, rules)).map(U.middle),
    )
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => solve(input, valid)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => solve(input, U.not(valid))
