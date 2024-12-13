import { type Grid, makeGrid } from "@/grid"

const parse = (input: string): Grid<string> => makeGrid(input)

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): number => {
    const data = parse(input)

    return data.length
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): number => {
    const data = parse(input)

    return data.length
}
