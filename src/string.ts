import { at } from "@/array"

export const match = (
    string: string,
    regex: RegExp,
): Omit<RegExpExecArray, "groups"> &
    Required<Pick<RegExpExecArray, "groups">> => at(matches(string, regex), 0)

export const matches = (
    string: string,
    regex: RegExp,
): (Omit<RegExpExecArray, "groups"> &
    Required<Pick<RegExpExecArray, "groups">>)[] =>
    [...string.matchAll(regex)].map(({ groups, ...matchRest }) => ({
        ...matchRest,
        groups: { ...groups },
    }))
