import { part01, part02 } from "@/20"
import { EXAMPLE_01 } from "@/20/example"
import { INPUT_01 } from "@/20/input"
import { describe, expect, test } from "bun:test"

describe("20", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01, 65)).toBe(0)
            expect(part01(EXAMPLE_01, 64)).toBe(1)
            expect(part01(EXAMPLE_01, 40)).toBe(2)
            expect(part01(EXAMPLE_01, 38)).toBe(3)
            expect(part01(EXAMPLE_01, 36)).toBe(4)
            expect(part01(EXAMPLE_01, 20)).toBe(5)
            expect(part01(EXAMPLE_01, 12)).toBe(8)
            expect(part01(EXAMPLE_01, 10)).toBe(10)
            expect(part01(EXAMPLE_01, 8)).toBe(14)
            expect(part01(EXAMPLE_01, 6)).toBe(16)
            expect(part01(EXAMPLE_01, 4)).toBe(30)
            expect(part01(EXAMPLE_01, 2)).toBe(44)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01, 100)).toBe(1441)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01, 76)).toBe(3)
            expect(part02(EXAMPLE_01, 74)).toBe(7)
            expect(part02(EXAMPLE_01, 72)).toBe(29)
            expect(part02(EXAMPLE_01, 70)).toBe(41)
            expect(part02(EXAMPLE_01, 68)).toBe(55)
            expect(part02(EXAMPLE_01, 66)).toBe(67)
            expect(part02(EXAMPLE_01, 64)).toBe(86)
            expect(part02(EXAMPLE_01, 62)).toBe(106)
            expect(part02(EXAMPLE_01, 60)).toBe(129)
            expect(part02(EXAMPLE_01, 58)).toBe(154)
            expect(part02(EXAMPLE_01, 56)).toBe(193)
            expect(part02(EXAMPLE_01, 54)).toBe(222)
            expect(part02(EXAMPLE_01, 52)).toBe(253)
            expect(part02(EXAMPLE_01, 50)).toBe(285)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01, 100)).toBe(1_021_490)
        })
    })
})
