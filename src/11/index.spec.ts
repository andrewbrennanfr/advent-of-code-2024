import { part01, part02 } from "@/11"
import { EXAMPLE_01 } from "@/11/example"
import { INPUT_01 } from "@/11/input"
import { describe, expect, test } from "bun:test"

describe("11", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(55_312)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(203_457)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(65_601_038_650_482)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(241_394_363_462_435)
        })
    })
})
