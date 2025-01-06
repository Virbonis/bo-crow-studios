import {
  countOdds1X2,
  countOddsMargin,
  getOddsTypeDescByOddsType,
  getOddsXKey,
  isOddsValid,
} from 'helper'

describe('OddsType', () => {
  describe('getOddsTypeDescByOddsType', () => {
    test('odds_type is 9', () => expect(getOddsTypeDescByOddsType(9)).toBe('B'))
    test('odds_type is H0', () => expect(getOddsTypeDescByOddsType('H0')).toBe('Indo'))
    test('odds_type is H1', () => expect(getOddsTypeDescByOddsType('H1')).toBe('Malay'))
    test('odds_type is H2', () => expect(getOddsTypeDescByOddsType('H2')).toBe('HK'))
    test('odds_type is H3', () => expect(getOddsTypeDescByOddsType('H3')).toBe('DEC'))
    test('odds_type is H4', () => expect(getOddsTypeDescByOddsType('H4')).toBe(''))
  })
  describe('isOddsValid', () => {
    test('Odds is Empty', () => expect(isOddsValid('')).toEqual([false, 'Odds is not valid']))
    test('GameType is not found and odds is more than 999.99', () =>
      expect(isOddsValid(1000, 28)).toEqual([false, 'Odd must be between 0 and 999.99']))
    test('Result is Resolved', () => expect(isOddsValid(1, 0)).toEqual([true]))
    describe('GameType is CSLive', () => {
      test('Odds is more than  999.99', () => {
        expect(isOddsValid(1000, 1001)).toEqual([false, 'Odd must be between 0 and 999.99'])
      })
      test('Odds is less than  999.99', () => {
        expect(isOddsValid(0, 1001)).toEqual([true])
      })
    })
    describe('GameType is AH, OU, and OE', () => {
      test('Odds is not between -1 and 1', () => {
        expect(isOddsValid(2, 0)).toEqual([false, 'Odd must be between -1 and 1'])
      })
    })
    describe('GameType is ML', () => {
      test('Odds is not between 0 and 100', () => {
        expect(isOddsValid(101, 12)).toEqual([false, 'Odd must be between -1 and 1'])
        expect(isOddsValid(99, 12)).toEqual([false, 'Odd must be between -1 and 1'])
      })
    })
    describe('GameType is FGLG', () => {
      test('Odds is more than 10', () => {
        expect(isOddsValid(11, 14)).toEqual([false, 'Odd must be between 0 and 10'])
      })
      test('Odds is less than 10', () => {
        expect(isOddsValid(9, 14)).toEqual([true])
      })
    })
  })
  describe('getOddsXKey', () => {
    test('GameType is 41', () => expect(getOddsXKey(41)).toBe('odds1'))
    test('GameType is 42', () => expect(getOddsXKey(42)).toBe('odds1'))
    test('GameType is 43', () => expect(getOddsXKey(43)).toBe('odds1'))
    test('GameType is 44', () => expect(getOddsXKey(44)).toBe('odds1'))
    test('GameType is 45', () => expect(getOddsXKey(45)).toBe('odds1'))
    test('GameType is 46', () => expect(getOddsXKey(46)).toBe('odds1'))
    test('GameType is 47', () => expect(getOddsXKey(47)).toBe('odds1'))
    test('GameType is 20', () => expect(getOddsXKey(20)).toBe('odds2'))
    test('GameType is 26', () => expect(getOddsXKey(26)).toBe('odds2'))
    test('GameType is 34', () => expect(getOddsXKey(34)).toBe('odds2'))
    test('GameType is 37', () => expect(getOddsXKey(37)).toBe('odds2'))
    test('GameType is 38', () => expect(getOddsXKey(38)).toBe('odds2'))
    test('GameType is 36', () => expect(getOddsXKey(36)).toBe('odds3'))
    test('GameType is 7', () => expect(getOddsXKey(7)).toBe('odds4'))
    test('GameType is 14', () => expect(getOddsXKey(14)).toBe('odds5'))
    test('GameType is 40', () => expect(getOddsXKey(40)).toEqual(['odds1', 'odds3']))
    test('GameType is null', () => expect(getOddsXKey('')).toBe(''))
  })
  test('countOddsMargin', () => {
    expect(countOddsMargin([1, 2, 0, 4, 5])).toBe(1.95)
  })
  describe('countOdds1X2', () => {
    test('OddsRes is more than 1', () => {
      expect(countOdds1X2(1, 1, 1, 1)).toEqual([
        2.9702970297029703,
        2.9702970297029703,
        2.9702970297029703,
      ])
    })
    test('OddsRes is less than 1', () => {
      expect(countOdds1X2(1, 2, 3, 500)).toEqual([1, 1, 1])
    })
  })
})
