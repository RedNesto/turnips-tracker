import {compareDates, isSunday} from "./helpers";

export enum DayHalf {
    Morning = 'morning',
    Afternoon = 'afternoon'
}

export type TurnipsEntry = {
    date: string,
    half?: DayHalf,
    bought?: number,
    sold?: number
    price: number
}

export function createTurnipsKey(entry: TurnipsEntry): string {
    if (entry.half) {
        return entry.date + '-' + entry.half
    }
    return entry.date
}

export class TurnipsNormalizationError extends Error {
    public readonly reason: TurnipsNormalizationErrorReason

    constructor(reason: TurnipsNormalizationErrorReason, entry: TurnipsEntry, message?: string) {
        super(message ?? `Could not normalize TurnipsEntry: ${reason} (${entry})`);
        this.reason = reason
    }
}

export enum TurnipsNormalizationErrorReason {
    DayHalfExpected = 'DayHalf expected'
}

export function normalizeTurnipsEntry(entry: TurnipsEntry): TurnipsEntry {
    const sunday = isSunday(entry.date);
    if (!sunday && !entry.half) {
        throw new TurnipsNormalizationError(TurnipsNormalizationErrorReason.DayHalfExpected, entry)
    }

    return {
        date: entry.date,
        half: !sunday ? entry.half : undefined,
        bought: sunday ? safeParseIntDecimal(entry.bought) : undefined,
        sold: !sunday ? safeParseIntDecimal(entry.sold) : undefined,
        price: safeParseIntDecimal(entry.price)
    }
}

/**
 * A convenient wrapper around {@link parseInt}, returns 0 if the input is invalid.
 *
 * The input is valid if it is a number (for convenience) or a string representing a decimal integer
 *
 * The input is invalid if `undefined` or the string does not represent a decimal integer and is not finite
 *
 * @param value a decimal string or a number (for convenience)
 * @returns the number if a valid decimal integer, 0 otherwise
 */
function safeParseIntDecimal(value?: string | number): number {
    if (!value) {
        return 0
    }

    if (typeof value === 'number') {
        return value
    }

    const parsed = parseInt(value, 10)
    if (isNaN(parsed) || !isFinite(parsed)) {
        return 0
    }

    return parsed
}

export function sortTurnipsEntries(a: TurnipsEntry, b: TurnipsEntry): number {
    if (a.date === b.date) {
        return a.half === DayHalf.Morning && b.half === DayHalf.Afternoon ? -1 : 1
    }
    return compareDates(a.date, b.date)
}

export function createTurnipsNumberChartData(entries: TurnipsEntry[]) {
    let dayLabels: string[] = []
    let sellingPriceData: Array<number | null> = []
    let buyingPriceData: Array<number | null> = []
    entries.forEach(entry => {
        const price = entry.price
        if (entry.sold != null) {
            const shortHalf = entry.half === DayHalf.Morning ? 'am' : 'pm'
            dayLabels.push(entry.date + shortHalf)
            sellingPriceData.push(price)
            buyingPriceData.push(null)
        } else {
            dayLabels.push(entry.date)
            sellingPriceData.push(null)
            buyingPriceData.push(price)
        }
    })

    function dataset(label: string, data: Array<number | null>, color: string) {
        return {
            label: label,
            data: data,
            pointRadius: 4,
            pointHoverRadius: 6,
            borderWidth: 4,
            spanGaps: true,
            pointBackgroundColor: color,
            backgroundColor: color,
            borderColor: color
        }
    }

    return {
        labels: dayLabels,
        datasets: [
            dataset('Selling Price', sellingPriceData, 'rgba(30, 144, 255, 0.2)'),
            dataset('Buying Price', buyingPriceData, 'rgba(255, 215, 0, 0.2)')
        ],
        options: {
            scales: {
                yAxes: [{
                    stacked: true
                }]
            }
        }
    }
}

export function createProfitChartData(entries: TurnipsEntry[]) {
    let weekLabels: string[] = []
    let weekProfits: number[] = []
    let weekBought = 0
    let weekSold = 0
    entries.sort(sortTurnipsEntries).forEach(entry => {
        if (entry.sold != null) {
            if (weekLabels.length === 0) {
                // Skip sold values that are not in a cycle (starting sunday)
                return
            }

            weekSold += entry.sold * entry.price
        } else {
            if (weekLabels.length !== 0) {
                weekProfits.push(weekSold - weekBought)
            }

            const bought = entry.bought ?? 0;
            weekLabels.push(entry.date)
            weekBought = bought * entry.price
            weekSold = 0
        }
    })

    if (weekBought > 0 || weekSold > 0) {
        weekProfits.push(weekSold - weekBought)
    }

    return {
        labels: weekLabels,
        datasets: [{
            label: 'Profit',
            data: weekProfits
        }]
    }
}
