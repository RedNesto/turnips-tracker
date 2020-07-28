import {createTurnipsKey, DayHalf, sortTurnipsEntries, TurnipsEntry} from "./Turnips";

it('should create correct turnips keys', () => {
    expect(createTurnipsKey({date: '2020-07-01', half: DayHalf.Morning, price: 100}))
        .toEqual('2020-07-01-morning')
    expect(createTurnipsKey({date: '2020-07-02', half: DayHalf.Afternoon, price: 100}))
        .toEqual('2020-07-02-afternoon')
    expect(createTurnipsKey({date: '2020-07-05', price: 100}))
        .toEqual('2020-07-05')
})

it('should sort turnips entries properly', () => {
    const original: Array<TurnipsEntry> = [
        {date: '2020-07-01', half: DayHalf.Morning, sold: 0, price: 100},
        {date: '2020-06-30', half: DayHalf.Afternoon, sold: 0, price: 100},
        {date: '2020-06-28', bought: 0, price: 100},
        {date: '2020-06-30', half: DayHalf.Morning, sold: 0, price: 100},
        {date: '2020-07-10', half: DayHalf.Afternoon, sold: 0, price: 100},
        {date: '2020-07-12', bought: 0, price: 100},
        {date: '2020-07-10', half: DayHalf.Morning, sold: 0, price: 100},
        {date: '2020-07-11', half: DayHalf.Afternoon, sold: 0, price: 100},
    ]
    const expected: Array<TurnipsEntry> = [
        {date: '2020-06-28', bought: 0, price: 100},
        {date: '2020-06-30', half: DayHalf.Morning, sold: 0, price: 100},
        {date: '2020-06-30', half: DayHalf.Afternoon, sold: 0, price: 100},
        {date: '2020-07-01', half: DayHalf.Morning, sold: 0, price: 100},
        {date: '2020-07-10', half: DayHalf.Morning, sold: 0, price: 100},
        {date: '2020-07-10', half: DayHalf.Afternoon, sold: 0, price: 100},
        {date: '2020-07-11', half: DayHalf.Afternoon, sold: 0, price: 100},
        {date: '2020-07-12', bought: 0, price: 100},
    ]
    expect(original.sort(sortTurnipsEntries)).toStrictEqual(expected)
})
