import { part01, part02 } from "@/17"
import { EXAMPLE_01, EXAMPLE_02 } from "@/17/example"
import { INPUT_01 } from "@/17/input"
import { describe, expect, test } from "bun:test"

describe("17", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe("4,6,3,5,6,3,5,2,1,0")
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe("1,6,3,6,5,6,5,1,7")
        })
    })

    describe("part02", () => {
        test("EXAMPLE_02", () => {
            expect(part02(EXAMPLE_02)).toBe(117_440n)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(247_839_653_009_594n)
        })
    })
})
