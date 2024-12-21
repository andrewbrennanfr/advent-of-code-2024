import { part01, part02 } from "@/21"
import { EXAMPLE_01 } from "@/21/example"
import { INPUT_01 } from "@/21/input"
import { describe, expect, test } from "bun:test"

describe("21", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(126_384)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(177_814)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(154_115_708_116_294)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(220_493_992_841_852)
        })
    })
})
