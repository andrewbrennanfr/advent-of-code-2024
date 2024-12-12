import * as U from "@/utils"

const parse = (
    input: string,
): { rules: Record<string, number[]>; updates: U.Grid<number> } => {
    const chunks = input.trim().split("\n\n")

    return {
        rules: Object.fromEntries(
            U.map2D(U.grid(U.at(chunks, 0), "|"), Number).flatMap((rule) => [
                [String(rule), rule],
                [String(rule.toReversed()), rule],
            ]),
        ),
        updates: U.map2D(U.grid(U.at(chunks, 1), ","), Number),
    }
}

const sort = (rules: Record<string, number[]>, update: number[]): number[] =>
    U.sort(update, (left, right) =>
        U.at(U.guard(rules[String([left, right])]), 0) === left ? -1 : 1,
    )

const valid = (rules: Record<string, number[]>, update: number[]): boolean =>
    String(sort(rules, update)) === String(update)

const solve = (
    input: string,
    valid: (rules: Record<string, number[]>, update: number[]) => boolean,
): number => {
    const { rules, updates } = parse(input)

    return U.sum(
        updates
            .filter((update) => valid(rules, update))
            .map((update) => sort(rules, update))
            .map((update) => U.at(update, Math.floor(update.length / 2))),
    )
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => solve(input, valid)

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(input, (rules, update) => !valid(rules, update))
