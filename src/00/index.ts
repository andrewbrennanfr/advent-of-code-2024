import * as U from "@/utils"

const parse = (input: string): U.Grid<string> => U.grid(input)

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
