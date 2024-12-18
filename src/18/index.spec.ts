import { part01, part02 } from "@/18"
import { EXAMPLE_01 } from "@/18/example"
import { INPUT_01 } from "@/18/input"
import { describe, expect, test } from "bun:test"

describe("18", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01, 7, 12)).toBe(22)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01, 71, 1024)).toBe(272)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01, 7)).toBe("6,1")
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01, 71)).toBe("16,44")
        })
    })
})
