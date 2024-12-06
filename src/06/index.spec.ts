import { part01, part02 } from "@/06"
import { EXAMPLE_01 } from "@/06/example"
import { INPUT_01 } from "@/06/input"
import { describe, expect, test } from "bun:test"

describe("06", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(41)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(5269)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(6)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(1957)
        })
    })
})
