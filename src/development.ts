export const log = <T>(value: T, ...args: unknown[]): T => {
    const values = [
        "\n\n",
        value,
        ...args.flatMap((arg) => ["\n", arg]),
        "\n\n",
    ]

    // eslint-disable-next-line no-console -- Logging is permitted here, as this is the purpose of this tool.
    console.log(...values)

    return value
}

export const guard = <T extends NonNullable<unknown> | null>(
    value: T,
    ...args: unknown[]
): NonNullable<T> => {
    if (value !== null) return value

    log(value, ...args)

    // eslint-disable-next-line no-restricted-syntax -- Throwing is permitted here, as this makes guarding possible.
    throw new Error(String(value))
}
