import { part01, part02 } from "@/04"
import { EXAMPLE_01 } from "@/04/example"
import { INPUT_01 } from "@/04/input"
import { describe, expect, test } from "bun:test"

describe("04", () => {
    describe("part01", () => {
        test.skip("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(18)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(2547)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(9)
        })

        test.skip("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(1939)
        })
    })
})
