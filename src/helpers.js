/**
 * Compares two dates stored in string in the format 'year-month-day'
 *
 * @param {string} a
 * @param {string} b
 * @return {int} 1 if a is greater than b, -1 if the opposite, 0 if they are equal, Number.MIN_SAFE_INTEGER if input is invalid
 */
export function compareDates(a, b) {
    if (!a || !b || typeof a !== "string" || typeof b !== "string") {
        return Number.MIN_SAFE_INTEGER
    }

    if (a === b) {
        // Shortcut as they are already equal as strings
        return 0
    }

    const splitA = a.split('-')
    const splitB = b.split('-')

    if (splitA.length !== 3 || splitB.length !== 3) {
        return Number.MIN_SAFE_INTEGER
    }

    for (let i = 0; i < 3; i++) {
        const segA = parseInt(splitA[i])
        const segB = parseInt(splitB[i])
        if (isNaN(segA) || isNaN(segB)) {
            return Number.MIN_SAFE_INTEGER
        }

        if (segA !== segB) {
            return segA < segB ? -1 : 1
        }
    }

    return 0
}
