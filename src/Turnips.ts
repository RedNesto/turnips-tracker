import {compareDates} from "./helpers";

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
    return entry.date + '-' + entry.half
}

export function sortTurnipsEntries(a: TurnipsEntry, b: TurnipsEntry): number {
    if (a.date === b.date) {
        return a.half === DayHalf.Morning && b.half === DayHalf.Afternoon ? -1 : 1
    }
    return compareDates(a.date, b.date)
}

export function createTurnipsNumberChartData(entries: Array<TurnipsEntry>) {
    let dayLabels: Array<string> = []
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

export function createProfitChartData(entries: Array<TurnipsEntry>) {
    let weekLabels: Array<string> = []
    let weekProfits: Array<number> = []
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
