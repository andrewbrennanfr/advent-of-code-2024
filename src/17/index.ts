import { at } from "@/array"
import { match, matches } from "@/string"
import { panic, safe } from "@/utils"

const parse = (
    input: string,
): {
    output: string
    pointer: bigint
    program: bigint[]
    registerA: bigint
    registerB: bigint
    registerC: bigint
} => {
    const chunks = input.trim().split("\n\n")

    const registers = matches(
        at(chunks, 0).trim(),
        /Register [A|B|C]: (?<register>\d+)/gu,
    ).map(({ groups }) => BigInt(groups["register"] ?? Number.MAX_SAFE_INTEGER))

    const program = safe(
        match(at(chunks, 1).trim(), /Program: (?<program>.+)/gu).groups[
            "program"
        ],
    )
        .split(",")
        .map(BigInt)

    return {
        output: "",
        pointer: 0n,
        program,
        registerA: at(registers, 0),
        registerB: at(registers, 1),
        registerC: at(registers, 2),
    }
}

const getCombo = (
    number: bigint,
    {
        registerA,
        registerB,
        registerC,
    }: { registerA: bigint; registerB: bigint; registerC: bigint },
): bigint => {
    if (number === 0n || number === 1n || number === 2n || number === 3n)
        return number

    if (number === 4n) return registerA

    if (number === 5n) return registerB

    if (number === 6n) return registerC

    return BigInt(Number.MAX_SAFE_INTEGER)
}

const run = ({
    output,
    pointer,
    program,
    registerA,
    registerB,
    registerC,
}: {
    output: string
    pointer: bigint
    program: bigint[]
    registerA: bigint
    registerB: bigint
    registerC: bigint
}): {
    output: string
    pointer: bigint
    program: bigint[]
    registerA: bigint
    registerB: bigint
    registerC: bigint
} => {
    if (pointer >= BigInt(program.length))
        return {
            output,
            pointer,
            program,
            registerA,
            registerB,
            registerC,
        }

    const opcode = at(program, Number(pointer))
    const operand = at(program, Number(pointer + 1n))
    const combo = getCombo(operand, { registerA, registerB, registerC })
    const literal = operand

    if (opcode === 0n) {
        const numerator = registerA
        const denominator = 2n ** combo
        const result = numerator / denominator

        return run({
            output,
            pointer: pointer + 2n,
            program,
            registerA: result,
            registerB,
            registerC,
        })
    }

    if (opcode === 1n) {
        const result = registerB ^ literal // eslint-disable-line no-bitwise

        return run({
            output,
            pointer: pointer + 2n,
            program,
            registerA,
            registerB: result,
            registerC,
        })
    }

    if (opcode === 2n) {
        const result = combo % 8n

        return run({
            output,
            pointer: pointer + 2n,
            program,
            registerA,
            registerB: result,
            registerC,
        })
    }

    if (opcode === 3n) {
        if (registerA === 0n)
            return run({
                output,
                pointer: pointer + 2n,
                program,
                registerA,
                registerB,
                registerC,
            })

        return run({
            output,
            pointer: literal,
            program,
            registerA,
            registerB,
            registerC,
        })
    }

    if (opcode === 4n) {
        const result = registerB ^ registerC // eslint-disable-line no-bitwise

        return run({
            output,
            pointer: pointer + 2n,
            program,
            registerA,
            registerB: result,
            registerC,
        })
    }

    if (opcode === 5n) {
        const result = combo % 8n

        return run({
            output:
                output === "" ? String(result) : `${output},${String(result)}`,
            pointer: pointer + 2n,
            program,
            registerA,
            registerB,
            registerC,
        })
    }

    if (opcode === 6n) {
        const numerator = registerA
        const denominator = 2n ** combo
        const result = numerator / denominator

        return run({
            output,
            pointer: pointer + 2n,
            program,
            registerA,
            registerB: result,
            registerC,
        })
    }

    if (opcode === 7n) {
        const numerator = registerA
        const denominator = 2n ** combo
        const result = numerator / denominator

        return run({
            output,
            pointer: pointer + 2n,
            program,
            registerA,
            registerB,
            registerC: result,
        })
    }

    return panic("run returned something else!")
}

/* --------------------------------- part01 --------------------------------- */

export const part01 = (input: string): string => {
    const data = parse(input)
    const result = run(data)

    return result.output
}

/* --------------------------------- part02 --------------------------------- */

export const part02 = (input: string): bigint => {
    const data = parse(input)
    const expected = data.program.map(String).join(",")

    const findMatch = (times: bigint, matched: bigint): bigint => {
        const result = run({ ...data, registerA: times })
        const splitOutput = result.output.split(",").map(BigInt)
        const outputMatched = splitOutput.slice(-1 * Number(matched) - 1)

        if (expected === result.output) return times

        if (
            outputMatched.join(",") ===
            data.program
                .slice(-1 * Number(matched) - 1)
                .map(String)
                .join(",")
        )
            return findMatch(times * 8n, matched + 1n)

        return findMatch(times + 1n, matched)
    }

    return findMatch(0n, 0n)
}
