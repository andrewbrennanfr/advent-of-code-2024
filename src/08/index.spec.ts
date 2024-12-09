import { part01, part02 } from "@/08"
import { EXAMPLE_01 } from "@/08/example"
import { INPUT_01 } from "@/08/input"
import { describe, expect, test } from "bun:test"

describe("08", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(14)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(409)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(34)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(1308)
        })
    })
})
