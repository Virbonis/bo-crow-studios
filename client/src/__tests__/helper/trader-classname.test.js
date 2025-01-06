import { getTraderClass } from 'helper'

describe('trader-classname', () => {
  describe('LastChange is odds', () => {
    test('traderGroup is TraderGroupIsBoss', () =>
      expect(getTraderClass('TraderGroupIsBoss', '', 0, 0, '', 'odds')).toBe('Boss'))
    test('traderGroup is TraderGroupIsSeniorSupervisor', () =>
      expect(getTraderClass('TraderGroupIsSeniorSupervisor', '', 0, 0, '', 'odds')).toBe('SpvOdds'))
    test('traderGroup is TraderGroupIsSpv', () =>
      expect(getTraderClass('TraderGroupIsSpv', '', 0, 0, '', 'odds')).toBe('SpvOdds'))
    test('traderGroup is TraderGroupIsSupervisor', () =>
      expect(getTraderClass('TraderGroupIsSupervisor', '', 0, 0, '', 'odds')).toBe('SpvOdds'))
    test('traderGroup is Empty', () => expect(getTraderClass('', '', 0, 0, '', 'odds')).toBe(''))
  })
  describe('LastChange is pause', () => {
    describe('traderGroupPause is TraderGroupIsBoss', () => {
      test('pause_status is 0', () =>
        expect(getTraderClass('', 'TraderGroupIsBoss', 0, 0, '', 'pause')).toBe(''))
      test('pause_status is 1', () =>
        expect(getTraderClass('', 'TraderGroupIsBoss', 0, 1, '', 'pause')).toBe('Boss'))
    })

    describe('traderGroupPause is TraderGroupIsSeniorSupervisor', () => {
      test('pause_status is 0', () =>
          expect(getTraderClass('', 'TraderGroupIsSeniorSupervisor', 0, 0, '', 'pause')).toBe('')) // prettier-ignore
      test('pause_status is 1', () =>
          expect(getTraderClass('', 'TraderGroupIsSeniorSupervisor', 0, 1, '', 'pause')).toBe('SpvPause')) // prettier-ignore
    })

    describe('traderGroupPause is TraderGroupIsSpv', () => {
      test('pause_status is 0', () =>
        expect(getTraderClass('', 'TraderGroupIsSpv', 0, 0, '', 'pause')).toBe(''))
      test('pause_status is 1', () =>
        expect(getTraderClass('', 'TraderGroupIsSpv', 0, 1, '', 'pause')).toBe('SpvPause'))
    })

    describe('traderGroupPause is TraderGroupIsSupervisor', () => {
      test('pause_status is 0', () =>
        expect(getTraderClass('', 'TraderGroupIsSupervisor', 0, 0, '', 'pause')).toBe(''))
      test('pause_status is 1', () =>
        expect(getTraderClass('', 'TraderGroupIsSupervisor', 0, 1, '', 'pause')).toBe('SpvPause'))
    })

    test('traderGroupPause is Empty', () =>
      expect(getTraderClass('', '', 0, 1, '', 'pause')).toBe(''))
  })
  describe('LastChange is empty', () => {
    describe('className', () => {
      describe('traderGroup is TraderGroupIsTrader', () => {
        test('alertTrader is 1', () =>
          expect(getTraderClass('TraderGroupIsTrader', 'TraderGroupIsBoss', 1, 1, '', '')).toBe('Trader3 Boss')) // prettier-ignore
        test('alertTrader is 0', () =>
          expect(getTraderClass('TraderGroupIsTrader', 'TraderGroupIsBoss', 0, 1, '', '')).toBe(' Boss')) // prettier-ignore
      })
      describe('traderGroup is TraderGroupIsLeeching', () => {
        test('alertTrader is 1', () =>
          expect(getTraderClass('TraderGroupIsLeeching', 'TraderGroupIsBoss', 1, 1, '', '')).toBe('TraderLeeching Boss')) // prettier-ignore
        test('alertTrader is 1', () =>
          expect(getTraderClass('TraderGroupIsLeeching', 'TraderGroupIsBoss', 0, 1, '', '')).toBe(' Boss')) // prettier-ignore
      })
    })

    describe('traderGroupPause is TraderGroupIsBoss', () => {
      test('pause_status is 1', () =>
        expect(getTraderClass('', 'TraderGroupIsBoss', 0, 1, '', '')).toBe(' Boss'))
      test('pause_status is 0', () =>
        expect(getTraderClass('', 'TraderGroupIsBoss', 0, 0, '', '')).toBe(' '))
    })

    describe('traderGroupPause is TraderGroupIsSeniorSupervisor', () => {
      test('pause_status is 1', () =>
        expect(getTraderClass('', 'TraderGroupIsSeniorSupervisor', 0, 1, '', '')).toBe(' SpvPause'))
      test('pause_status is 0', () =>
        expect(getTraderClass('', 'TraderGroupIsSeniorSupervisor', 0, 0, '', '')).toBe(' '))
    })

    describe('traderGroupPause is TraderGroupIsSpv', () => {
      test('pause_status is 1', () =>
        expect(getTraderClass('', 'TraderGroupIsSpv', 0, 1, '', '')).toBe(' SpvPause'))
      test('pause_status is 0', () =>
        expect(getTraderClass('', 'TraderGroupIsSpv', 0, 0, '', '')).toBe(' '))
    })

    describe('traderGroupPause is TraderGroupIsSupervisor', () => {
      test('pause_status is 1', () =>
        expect(getTraderClass('', 'TraderGroupIsSupervisor', 0, 1, '', '')).toBe(' SpvPause'))
      test('pause_status is 0', () =>
        expect(getTraderClass('', 'TraderGroupIsSupervisor', 0, 0, '', '')).toBe(' '))
    })

    describe('traderGroupPause is TraderGroupIsTrader', () => {
      test('pause_status is 1', () =>
        expect(getTraderClass('', 'TraderGroupIsTrader', 0, 1, '', '')).toBe(' TraderPause'))
      test('pause_status is 0', () =>
        expect(getTraderClass('', 'TraderGroupIsTrader', 0, 0, '', '')).toBe(' '))
    })
    test('traderGroupPause is Empty', () => expect(getTraderClass('', '', 0, 0, '', '')).toBe(''))
  })
})
