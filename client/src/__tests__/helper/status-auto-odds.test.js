import { StatusAutoOdds } from 'helper'

describe('status-auto-odds', () => {
  test('Follow Leeching is 0', () => expect(StatusAutoOdds('0')).toBe(''))
  test('Follow Leeching is 1', () => expect(StatusAutoOdds('1')).toBe('S'))
  test('Follow Leeching is 2', () => expect(StatusAutoOdds('2')).toBe('I'))
  test('Follow Leeching is S', () => expect(StatusAutoOdds('S')).toBe('1'))
  test('Follow Leeching is I', () => expect(StatusAutoOdds('I')).toBe('2'))
  test('Follow Leeching is not found', () => expect(StatusAutoOdds('3')).toBe('0'))
})
