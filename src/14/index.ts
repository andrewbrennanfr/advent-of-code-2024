import { mutateMap } from "@/mutation"
import { circularNumber, middle, product } from "@/number"
import { matches } from "@/string"
import { safe } from "@/utils"

type Position = Record<"pc" | "pr" | "vc" | "vr", number>

const parse = (input: string): Position[] =>
    matches(
        input.trim(),
        /p=(?<pc>-?[0-9]+),(?<pr>-?[0-9]+) v=(?<vc>-?[0-9]+),(?<vr>-?[0-9]+)/gu,
    ).map(({ groups }) => ({
        pc: Number(groups["pc"]),
        pr: Number(groups["pr"]),
        vc: Number(groups["vc"]),
        vr: Number(groups["vr"]),
    }))

const move = (
    positions: Position[],
    { height, width }: { height: number; width: number },
    times = 100,
): Position[] => {
    if (times === 0) return positions

    const nextPositions = positions.map(({ ...position }) => ({
        ...position,
        pc: circularNumber(width, position.pc + position.vc),
        pr: circularNumber(height, position.pr + position.vr),
    }))

    return move(nextPositions, { height, width }, times - 1)
}

const findChristmasTree = (
    positions: Position[],
    { height, width }: { height: number; width: number },
    times = 0,
    visited = new Map<string, number>(),
    // eslint-disable-next-line @typescript-eslint/max-params
): number => {
    const positionsHash = JSON.stringify(positions)

    if (visited.has(positionsHash)) {
        const allPositionCombinations = [...visited.keys()].map(
            (positionHash) => JSON.parse(positionHash) as Position[], // eslint-disable-line @typescript-eslint/no-unsafe-type-assertion
        )

        const positionsBySafetyFactor = Object.fromEntries(
            allPositionCombinations.map((positionsCombination) => {
                const safetyFactor = getSafetyFactor(positionsCombination, {
                    height,
                    width,
                })

                return [
                    String(safetyFactor),
                    JSON.stringify(positionsCombination),
                ]
            }),
        )

        const minSafetyFactor = Math.min(
            ...Object.keys(positionsBySafetyFactor).map(Number),
        )

        const minSafePositionsHash = safe(
            positionsBySafetyFactor[String(minSafetyFactor)],
        )

        return safe(visited.get(minSafePositionsHash))
    }

    const nextVisited = mutateMap(visited, [[positionsHash, times]])

    const nextPositions = move(positions, { height, width }, 1)

    return findChristmasTree(
        nextPositions,
        { height, width },
        times + 1,
        nextVisited,
    )
}

const getSafetyFactor = (
    positions: Position[],
    { height, width }: { height: number; width: number },
): number => {
    const middleR = middle(height)
    const middleC = middle(width)

    const topLeft = positions.filter(
        ({ pc, pr }) => pr < middleR && pc < middleC,
    )
    const topRight = positions.filter(
        ({ pc, pr }) => pr < middleR && pc > middleC,
    )
    const bottomLeft = positions.filter(
        ({ pc, pr }) => pr > middleR && pc < middleC,
    )
    const bottomRight = positions.filter(
        ({ pc, pr }) => pr > middleR && pc > middleC,
    )

    return product([
        topLeft.length,
        topRight.length,
        bottomLeft.length,
        bottomRight.length,
    ])
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (
    input: string,
    { height, width }: { height: number; width: number },
): number => {
    const startingPositions = parse(input)
    const endingPositions = move(startingPositions, { height, width }, 100)

    return getSafetyFactor(endingPositions, { height, width })
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (
    input: string,
    { height, width }: { height: number; width: number },
): number => {
    const startingPositions = parse(input)

    return findChristmasTree(startingPositions, {
        height,
        width,
    })
}
