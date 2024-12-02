import { part01, part02 } from "@/02"
import { EXAMPLE_01 } from "@/02/example"
import { INPUT_01 } from "@/02/input"
import { describe, expect, test } from "bun:test"

describe("02", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(2)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(287)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(4)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(354)
        })
    })
})
