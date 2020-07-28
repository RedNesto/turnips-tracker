import {createTurnipsKey, DayHalf, normalizeTurnipsEntry, sortTurnipsEntries, TurnipsEntry, TurnipsNormalizationError, TurnipsNormalizationErrorReason} from "./Turnips";

it('should create correct turnips keys', () => {
    expect(createTurnipsKey({date: '2020-07-01', half: DayHalf.Morning, price: 100}))
        .toEqual('2020-07-01-morning')
    expect(createTurnipsKey({date: '2020-07-02', half: DayHalf.Afternoon, price: 100}))
        .toEqual('2020-07-02-afternoon')
    expect(createTurnipsKey({date: '2020-07-05', price: 100}))
        .toEqual('2020-07-05')
})

it('should normalize entries correctly', () => {
    expect(normalizeTurnipsEntry({date: '2020-07-01', half: DayHalf.Morning, sold: 1000, price: 100}))
        .toEqual({date: '2020-07-01', half: DayHalf.Morning, sold: 1000, price: 100})
    expect(normalizeTurnipsEntry({date: '2020-07-05', half: DayHalf.Morning, bought: 1000, price: 100}))
        .toEqual({date: '2020-07-05', bought: 1000, price: 100})
    expect(normalizeTurnipsEntry({date: '2020-07-05', half: DayHalf.Morning, sold: 1000, price: 100}))
        .toEqual({date: '2020-07-05', bought: 0, price: 100})
    expect(normalizeTurnipsEntry({date: '2020-07-01', half: DayHalf.Morning, bought: 1000, price: 100}))
        .toEqual({date: '2020-07-01', half: DayHalf.Morning, sold: 0, price: 100})
    expect(normalizeTurnipsEntry({date: '2020-07-01', half: DayHalf.Morning, sold: 1000, price: 100}))
        .toEqual({date: '2020-07-01', half: DayHalf.Morning, sold: 1000, price: 100})

    expect(normalizeTurnipsEntry({date: '2020-07-05', bought: '1000', price: '100'} as any))
        .toEqual({date: '2020-07-05', bought: 1000, price: 100})
    expect(normalizeTurnipsEntry({date: '2020-07-05', sold: '10', price: '100'} as any))
        .toEqual({date: '2020-07-05', bought: 0, price: 100})
    expect(normalizeTurnipsEntry({date: '2020-07-01', half: 'morning', bought: '1000', price: 100} as any))
        .toEqual({date: '2020-07-01', half: DayHalf.Morning, sold: 0, price: 100})
    expect(normalizeTurnipsEntry({date: '2020-07-01', half: 'afternoon', sold: '1000', price: 100} as any))
        .toEqual({date: '2020-07-01', half: DayHalf.Afternoon, sold: 1000, price: 100})
})

it("should throw error if can't normalize", () => {
    const testEntry1 = {date: '2020-07-01', bought: 1000, price: 100};
    expect(() => normalizeTurnipsEntry(testEntry1))
        .toThrow(new TurnipsNormalizationError(TurnipsNormalizationErrorReason.DayHalfExpected, testEntry1))
})

it('should sort turnips entries properly', () => {
    const original: TurnipsEntry[] = [
        {date: '2020-07-01', half: DayHalf.Morning, sold: 0, price: 100},
        {date: '2020-06-30', half: DayHalf.Afternoon, sold: 0, price: 100},
        {date: '2020-06-28', bought: 0, price: 100},
        {date: '2020-06-30', half: DayHalf.Morning, sold: 0, price: 100},
        {date: '2020-07-10', half: DayHalf.Afternoon, sold: 0, price: 100},
        {date: '2020-07-12', bought: 0, price: 100},
        {date: '2020-07-10', half: DayHalf.Morning, sold: 0, price: 100},
        {date: '2020-07-11', half: DayHalf.Afternoon, sold: 0, price: 100},
    ]
    const expected: TurnipsEntry[] = [
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
