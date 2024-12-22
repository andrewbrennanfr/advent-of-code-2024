import { part01, part02 } from "@/22"
import { EXAMPLE_01, EXAMPLE_02 } from "@/22/example"
import { INPUT_01 } from "@/22/input"
import { describe, expect, test } from "bun:test"

describe("22", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(37_327_623n)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(13_584_398_738n)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_02)).toBe(23)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(1612)
        })
    })
})
