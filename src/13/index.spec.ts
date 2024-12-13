import { part01, part02 } from "@/13"
import { EXAMPLE_01 } from "@/13/example"
import { INPUT_01 } from "@/13/input"
import { describe, expect, test } from "bun:test"

describe("13", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(480)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(31_552)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe(875_318_608_908)
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(95_273_925_552_482)
        })
    })
})
