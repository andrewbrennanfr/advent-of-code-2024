import { part01, part02 } from "@/00"
import { EXAMPLE_01 } from "@/00/example"
import { INPUT_01 } from "@/00/input"
import { describe, expect, test } from "bun:test"

describe("00", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(1)
        })

        test.todo("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(1)
        })
    })

    describe.todo("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(1)
        })

        test.todo("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(1)
        })
    })
})
