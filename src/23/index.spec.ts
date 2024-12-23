import { part01, part02 } from "@/23"
import { EXAMPLE_01 } from "@/23/example"
import { INPUT_01 } from "@/23/input"
import { describe, expect, test } from "bun:test"

describe("23", () => {
    describe("part01", () => {
        test("EXAMPLE_01", () => {
            expect(part01(EXAMPLE_01)).toBe(7)
        })

        test("INPUT_01", () => {
            expect(part01(INPUT_01)).toBe(1366)
        })
    })

    describe("part02", () => {
        test("EXAMPLE_01", () => {
            expect(part02(EXAMPLE_01)).toBe("co,de,ka,ta")
        })

        test("INPUT_01", () => {
            expect(part02(INPUT_01)).toBe(
                "bs,cf,cn,gb,gk,jf,mp,qk,qo,st,ti,uc,xw",
            )
        })
    })
})
