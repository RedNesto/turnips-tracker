import {compareDates} from "./helpers"

it('should sort dates correctly for days', () => {
    expect(compareDates("2020-05-28", "2020-05-28")).toEqual(0)
    expect(compareDates("2020-05-28", "2020-05-29")).toEqual(-1)
    expect(compareDates("2020-05-29", "2020-05-28")).toEqual(1)
})

it('should sort dates correctly for months', function () {
    expect(compareDates("2020-05-01", "2020-05-01")).toEqual(0)
    expect(compareDates("2020-04-01", "2020-05-01")).toEqual(-1)
    expect(compareDates("2020-05-01", "2020-04-01")).toEqual(1)
})

it('should sort dates correctly for years', function () {
    expect(compareDates("2020-05-01", "2020-05-01")).toEqual(0)
    expect(compareDates("2019-05-01", "2020-05-01")).toEqual(-1)
    expect(compareDates("2020-05-01", "2019-05-01")).toEqual(1)
})

it('should sort completely different dates correctly', function () {
    expect(compareDates("2020-05-01", "2020-06-28")).toEqual(-1)
    expect(compareDates("2020-05-01", "2019-01-15")).toEqual(1)
    expect(compareDates("2021-10-20", "2020-10-01")).toEqual(1)
})

it('should handle malformed input', function () {
    expect(compareDates(null, null)).toEqual(Number.MIN_SAFE_INTEGER)
    expect(compareDates(null, "2020-05-28")).toEqual(Number.MIN_SAFE_INTEGER)
    expect(compareDates("2020-05-28", null)).toEqual(Number.MIN_SAFE_INTEGER)
    expect(compareDates("2020-05-28", "05-28")).toEqual(Number.MIN_SAFE_INTEGER)
    expect(compareDates("2020-05-28", "-05-28")).toEqual(Number.MIN_SAFE_INTEGER)
    expect(compareDates("2020-05-28", "-05-28")).toEqual(Number.MIN_SAFE_INTEGER)
    expect(compareDates("2020-05", "2020-05-28")).toEqual(Number.MIN_SAFE_INTEGER)
    expect(compareDates("2020-aa-28", "2020-05-28")).toEqual(Number.MIN_SAFE_INTEGER)
    expect(compareDates("2020-aa-28", "bb-05-28")).toEqual(Number.MIN_SAFE_INTEGER)
    expect(compareDates("bbbbb", "2020-05-28")).toEqual(Number.MIN_SAFE_INTEGER)
    expect(compareDates("-----", "2020-05-28")).toEqual(Number.MIN_SAFE_INTEGER)
})
