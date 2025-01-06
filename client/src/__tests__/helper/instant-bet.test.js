import { getStatusAcRj } from 'helper'

describe('getStatusAcRj', () => {
  test('status is 0', () => expect(getStatusAcRj(0, 0, 0, 0)).toBe('[P]'))
  test('void_id is 90', () => expect(getStatusAcRj(1, 90, 0, 0)).toBe('RC'))
  test('void_id is 91', () => expect(getStatusAcRj(1, 91, 0, 0)).toBe('RG'))
  test('void_id is 92', () => expect(getStatusAcRj(1, 92, 0, 0)).toBe('RP'))
  test('void_id is 93', () => expect(getStatusAcRj(1, 93, 0, 0)).toBe('CR'))
  test('void_id is 100', () => expect(getStatusAcRj(1, 100, 0, 0)).toBe('Rj'))
  test('status is 1 AND ev_round is 2 AND void_id is 0', () =>
    expect(getStatusAcRj(1, 0, 0, 2)).toBe('HT'))
  test('status is -1 AND void_id is 0', () => expect(getStatusAcRj(-1, 0, 0, 0)).toBe(''))
  test('status is -1 AND void_id is 0 AND ev_round is greater than 0', () =>
    expect(getStatusAcRj(-1, 0, 2, 2)).toBe('E'))
})
