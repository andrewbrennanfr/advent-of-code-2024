import { part01, part02 } from "@/14"
import { EXAMPLE_01 } from "@/14/example"
import { INPUT_01 } from "@/14/input"
import { describe, expect, test } from "bun:test"

describe("14", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01, { height: 7, width: 11 })).toBe(12)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01, { height: 103, width: 101 })).toBe(
                222_208_000,
            )
        })
    })

    describe("part02", () => {
        test("INPUT_01", () => {
            expect(part02(INPUT_01, { height: 103, width: 101 })).toBe(7623)
        })
    })
})
