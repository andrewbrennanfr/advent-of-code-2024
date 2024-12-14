export const circularNumber = (size: number, index: number): number =>
    ((index % size) + size) % size

export const distance = (left: number, right: number): number =>
    Math.abs(left - right)

export const isBetween = (
    left: number,
    number: number,
    right: number,
): boolean =>
    (left <= number && number <= right) || (left >= number && number >= right)

export const isEven = (number: number): boolean => number % 2 === 0

export const isOdd = (number: number): boolean => !isEven(number)

export const middle = (number: number): number => Math.floor(number / 2)

export const product = (numbers: number[]): number =>
    numbers.reduce((left, right) => left * right, Number(numbers.length > 0))

export const sum = (numbers: number[]): number =>
    numbers.reduce((left, right) => left + right, 0)
