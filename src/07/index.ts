import { at } from "@/array"
import { type Grid, makeGrid, mapGrid } from "@/grid"
import { sum } from "@/number"

const parse = (input: string): Grid<number> =>
    mapGrid(makeGrid(input, /: | /u), Number)

const solve = (
    equations: Grid<number>,
    ...operators: ((left: number, right: number) => number)[]
): number => {
    const correctEquations = equations.filter((equation) => {
        const answer = at(equation, 0)
        const inputs = equation.slice(1)

        const answers = inputs.reduce<number[]>((left, right) => {
            if (left.length === 0) return [right]

            return left.flatMap((value) => {
                const nextAnswers = operators.map((operator) =>
                    operator(value, right),
                )

                return nextAnswers.filter((nextAnswer) => nextAnswer <= answer)
            })
        }, [])

        return answers.includes(answer)
    })

    const correctAnswers = correctEquations.map((equation) => at(equation, 0))

    return sum(correctAnswers)
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number =>
    solve(
        parse(input),
        (left, right) => left + right,
        (left, right) => left * right,
    )

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number =>
    solve(
        parse(input),
        (left, right) => left + right,
        (left, right) => left * right,
        (left, right) => Number(`${left}${right}`),
    )
