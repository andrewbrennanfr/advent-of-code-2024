import { part01, part02 } from "@/16"
import { EXAMPLE_01, EXAMPLE_02 } from "@/16/example"
import { INPUT_01 } from "@/16/input"
import { describe, expect, test } from "bun:test"

describe("16", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(7036)
        })

        test("EXAMPLE_02", () => {
            expect(part01(EXAMPLE_02)).toBe(11_048)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(92_432)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(45)
        })

        test("EXAMPLE_02", () => {
            expect(part02(EXAMPLE_02)).toBe(64)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(458)
        })
    })
})
