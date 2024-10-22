import { part01, part02 } from "@/00"
import { example01 } from "@/00/example"
import { input01 } from "@/00/input"
import { describe, expect, test } from "vitest"

describe("00", () => {
    describe.todo("part01", () => {
        test("example01", () => {
            // Arrange
            const example = example01()

            // Act
            const result = part01(example)

            // Assert
            expect(result).toBe("")
        })

        test.todo("input01", () => {
            // Arrange
            const input = input01()

            // Act
            const result = part01(input)

            // Assert
            expect(result).toBe("")
        })
    })

    describe.todo("part02", () => {
        test("example01", () => {
            // Arrange
            const example = example01()

            // Act
            const result = part02(example)

            // Assert
            expect(result).toBe("")
        })

        test.todo("input01", () => {
            // Arrange
            const input = input01()

            // Act
            const result = part02(input)

            // Assert
            expect(result).toBe("")
        })
    })
})
