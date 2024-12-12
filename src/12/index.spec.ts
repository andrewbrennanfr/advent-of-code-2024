import { part01, part02 } from "@/12"
import { EXAMPLE_01 } from "@/12/example"
import { INPUT_01 } from "@/12/input"
import { describe, expect, test } from "bun:test"

describe("12", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(1930)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(1_371_306)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(1206)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(805_880)
        })
    })
})
