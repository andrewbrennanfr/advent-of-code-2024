import { guard, log } from "@/development"
import { describe, expect, test, vi } from "vitest"

describe("Given the guard function", () => {
    describe("When called with a non-null value", () => {
        test("Then the value is returned", () => {
            // Arrange
            const value = "hello"

            // Act
            const result = guard(value)

            // Assert
            expect(result).toBe(value)
        })

        test("Then nothing is printed to the console", () => {
            // Arrange
            const spy = vi.spyOn(console, "log").mockImplementationOnce(vi.fn())
            const value = "hello"

            // Act
            guard(value)

            // Assert
            expect(spy).toBeCalledTimes(0)
        })
    })

    describe("When called with a null value", () => {
        test("Then an error is thrown & null is printed to the console", () => {
            // Arrange
            const spy = vi.spyOn(console, "log").mockImplementationOnce(vi.fn())

            // Act
            const act = (): never => guard(null)

            // Assert
            expect(act).toThrowError("null")
            expect(spy).toBeCalledTimes(1)
            expect(spy).toBeCalledWith("\n\n", null, "\n\n")
        })
    })

    describe("When called with null & other arguments", () => {
        test("Then an error is throw & the arguments are printed to the console", () => {
            // Arrange
            const spy = vi.spyOn(console, "log").mockImplementationOnce(vi.fn())

            // Act
            const act = (): never => guard(null, "hello", "world")

            // Assert
            expect(act).toThrowError("null")
            expect(spy).toBeCalledTimes(1)
            expect(spy).toBeCalledWith(
                "\n\n",
                null,
                "\n",
                "hello",
                "\n",
                "world",
                "\n\n",
            )
        })
    })
})

describe("Given the log function", () => {
    describe("When called with a single argument", () => {
        test("Then the argument is printed to the console", () => {
            // Arrange
            const spy = vi.spyOn(console, "log").mockImplementationOnce(vi.fn())

            // Act
            log("hello")

            // Assert
            expect(spy).toBeCalledTimes(1)
            expect(spy).toBeCalledWith("\n\n", "hello", "\n\n")
        })

        test("Then the argument is returned", () => {
            // Arrange
            vi.spyOn(console, "log").mockImplementationOnce(vi.fn())

            // Act
            const result = log("hello")

            // Assert
            expect(result).toBe("hello")
        })
    })

    describe("When called with multiple arguments", () => {
        test("Then the arguments are printed to the console", () => {
            // Arrange
            const spy = vi.spyOn(console, "log").mockImplementationOnce(vi.fn())

            // Act
            log("hello", "world")

            // Assert
            expect(spy).toBeCalledTimes(1)
            expect(spy).toBeCalledWith("\n\n", "hello", "\n", "world", "\n\n")
        })

        test("Then the first argument is returned", () => {
            // Arrange
            vi.spyOn(console, "log").mockImplementationOnce(vi.fn())

            // Act
            const result = log("hello", "world")

            // Assert
            expect(result).toBe("hello")
        })
    })
})
