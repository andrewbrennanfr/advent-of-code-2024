import { part01, part02 } from "@/15"
import { EXAMPLE_01 } from "@/15/example"
import { INPUT_01 } from "@/15/input"
import { describe, expect, test } from "bun:test"

describe("15", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(10_092)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(1_552_463)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(9021)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(1_554_058)
        })
    })
})
