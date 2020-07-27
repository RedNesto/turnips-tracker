import moment from "moment";

/**
 * Compares two dates stored in string in the format 'year-month-day'
 *
 * @param {string} a
 * @param {string} b
 * @return {int} 1 if a is greater than b, -1 if the opposite, 0 if they are equal, Number.MIN_SAFE_INTEGER if input is invalid
 */
export function compareDates(a: string, b: string) {
    if (!a || !b) {
        return Number.MIN_SAFE_INTEGER
    }

    if (a === b) {
        // Shortcut if they are already equal as strings
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

export function dayForDate(date: string) {
    return moment(date, 'yyyy-MM-DD').format('dddd')
}

export function isSunday(date: string) {
    return moment(date, 'yyyy-MM-DD').weekday() === 0
}
