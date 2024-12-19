import { part01, part02 } from "@/19"
import { EXAMPLE_01 } from "@/19/example"
import { INPUT_01 } from "@/19/input"
import { describe, expect, test } from "bun:test"

describe("19", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(6)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(353)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(16)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(880_877_787_214_477)
        })
    })
})
