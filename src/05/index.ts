import * as U from "@/utils"

const parse = (
    input: string,
): { rules: Record<string, number[]>; updates: number[][] } => {
    const chunks = input.trim().split("\n\n")

    return {
        rules: Object.fromEntries(
            U.map2D(U.grid(U.at(chunks, 0), "|"), Number).map((rule) => [
                String(rule),
                rule,
            ]),
        ),
        updates: U.map2D(U.grid(U.at(chunks, 1), ","), Number),
    }
}

const sort = (rules: Record<string, number[]>, update: number[]): number[] =>
    U.sort(update, (left, right) =>
        (
            U.at(
                U.guard(
                    rules[String([left, right])] ??
                        rules[String([right, left])],
                ),
                0,
            ) === left
        ) ?
            -1
        :   1,
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
