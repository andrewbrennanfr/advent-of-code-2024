import { part01, part02 } from "@/10"
import { EXAMPLE_01 } from "@/10/example"
import { INPUT_01 } from "@/10/input"
import { describe, expect, test } from "bun:test"

describe("10", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(36)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(472)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(81)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(969)
        })
    })
})
