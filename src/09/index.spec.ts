import { part01, part02 } from "@/09"
import { EXAMPLE_01 } from "@/09/example"
import { INPUT_01 } from "@/09/input"
import { describe, expect, test } from "bun:test"

describe("09", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(1928)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(6_401_092_019_345)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(2858)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(6_431_472_344_710)
        })
    })
})
