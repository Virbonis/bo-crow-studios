import { applyFilterCategories } from 'helper'

describe('match-category', () => {
  describe('applyFilterCategories', () => {
    describe('leagueCategory AND category are not empty', () => {
      test('Filter Category - All Visible', () =>
        expect(applyFilterCategories('0^1', '0^1')).toEqual([
          { value: '0', label: 'Normal', checked: true },
          {
            value: '1',
            label: 'Special - Normal',
            checked: true,
          },
        ]))
      test('Filter Category - Few are checked', () =>
        expect(applyFilterCategories('1', '0^1')).toEqual([
          {
            value: '0',
            label: 'Normal',
            checked: false,
          },
          {
            value: '1',
            label: 'Special - Normal',
            checked: true,
          },
        ]))
    })
  })
  test('leagueCategory AND category are empty', () => {
    expect(applyFilterCategories('', '')).toEqual([])
  })
})
