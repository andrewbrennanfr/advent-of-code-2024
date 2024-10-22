import { measure, memoize } from "@/performance"
import { describe, expect, test, vi } from "vitest"

describe("Given the measure function", () => {
    describe("When called for the first time", () => {
        test("Then the timer is started", () => {
            // Arrange
            const spy = vi.spyOn(performance, "now").mockReturnValueOnce(1)

            // Act
            measure()

            // Assert
            expect(spy).toBeCalledTimes(1)
        })
    })

    describe("When the returned function is called", () => {
        test("Then the timer is stopped", () => {
            // Arrange
            const spy = vi
                .spyOn(performance, "now")
                .mockReturnValueOnce(1)
                .mockReturnValueOnce(99)

            const stop = measure()

            // Act
            stop()

            // Assert
            expect(spy).toBeCalledTimes(2)
        })

        test("Then the duration is returned", () => {
            // Arrange
            vi.spyOn(performance, "now")
                .mockReturnValueOnce(1)
                .mockReturnValueOnce(99)

            const stop = measure()

            // Act
            const result = stop()

            // Assert
            expect(result).toBe(98)
        })
    })
})

describe("Given the memoize function", () => {
    describe("When the wrapped function is called once", () => {
        test("Then the original function is called once", () => {
            // Arrange
            const spy = vi.fn(String).mockReturnValueOnce("hello world")
            const memoSpy = memoize(spy, JSON.stringify)

            // Act
            memoSpy("hello", "world")

            // Assert
            expect(spy).toBeCalledTimes(1)
            expect(spy).toBeCalledWith("hello", "world")
        })

        test("Then the result of the original function is returned", () => {
            // Arrange
            const spy = vi.fn(String).mockReturnValueOnce("hello world")
            const memoSpy = memoize(spy, JSON.stringify)

            // Act
            const result = memoSpy("hello", "world")

            // Assert
            expect(result).toBe("hello world")
        })
    })

    describe("When the wrapped function is called twice with different arguments", () => {
        test("Then the original function is called twice", () => {
            // Arrange
            const spy = vi
                .fn(String)
                .mockReturnValueOnce("hello world")
                .mockReturnValueOnce("world hello")
            const memoSpy = memoize(spy, JSON.stringify)

            // Act
            memoSpy("hello", "world")
            memoSpy("world", "hello")

            // Assert
            expect(spy).toBeCalledTimes(2)
            expect(spy).nthCalledWith(1, "hello", "world")
            expect(spy).nthCalledWith(2, "world", "hello")
        })

        test("Then the result of the original function is returned", () => {
            // Arrange
            const spy = vi
                .fn(String)
                .mockReturnValueOnce("hello world")
                .mockReturnValueOnce("world hello")
            const memoSpy = memoize(spy, JSON.stringify)

            // Act
            const result1 = memoSpy("hello", "world")
            const result2 = memoSpy("world", "hello")

            // Assert
            expect(result1).toBe("hello world")
            expect(result2).toBe("world hello")
        })
    })

    describe("When the wrapped function is called twice with the same arguments", () => {
        test("Then the original function is called once", () => {
            // Arrange
            const spy = vi.fn(String).mockReturnValueOnce("hello world")
            const memoSpy = memoize(spy, JSON.stringify)

            // Act
            memoSpy("hello", "world")
            memoSpy("hello", "world")

            // Assert
            expect(spy).toBeCalledTimes(1)
            expect(spy).toBeCalledWith("hello", "world")
        })

        test("Then the result of the original function is returned", () => {
            // Arrange
            const spy = vi.fn(String).mockReturnValueOnce("hello world")
            const memoSpy = memoize(spy, JSON.stringify)

            // Act
            const result1 = memoSpy("hello", "world")
            const result2 = memoSpy("hello", "world")

            // Assert
            expect(result1).toBe("hello world")
            expect(result2).toBe("hello world")
        })
    })

    describe("When the original function performs a heavy operation", () => {
        test("Then the wrapped function is optimized", () => {
            // Arrange
            const memoSpy = memoize(
                (number: number): number =>
                    number > 1
                        ? memoSpy(number - 1) + memoSpy(number - 2)
                        : number,
                JSON.stringify,
            )

            // Act
            const result = memoSpy(80)

            // Assert
            expect(result).toBe(23416728348467684)
        })
    })
})
