import { getCancelMatchOptions, getScoringMatchOptions } from 'helper'

describe('getEarlySettlement', () => {
  describe('getScoringMatchOptions', () => {
    describe('GameType is 20 and 22', () => {
      test('GameType is 20', () =>
        expect(getScoringMatchOptions(20)).toEqual([
          { value: 0, label: 'Unscored/To Reset' },
          { value: 1, label: 'Yes' },
          { value: -1, label: 'No' },
        ]))
      test('GameType is 22', () =>
        expect(getScoringMatchOptions(22)).toEqual([
          { value: 0, label: 'Unscored/To Reset' },
          { value: 1, label: 'Yes' },
          { value: -1, label: 'No' },
        ]))
    })
    test('GameType is 21', () => {
      expect(getScoringMatchOptions(21)).toEqual([
        { value: 0, label: 'Unscored/To Reset' },
        { value: 1, label: 'Free Kick' },
        { value: 2, label: 'Header' },
        { value: 3, label: 'No Goal' },
        { value: 4, label: 'Own Goal' },
        { value: 5, label: 'Penalty' },
        { value: 6, label: 'Shot' },
      ])
    })
    describe('GameType is 23 and 24', () => {
      test('GameType is 23', () =>
        expect(getScoringMatchOptions(23)).toEqual([
          { value: 0, label: 'Unscored/To Reset' },
          { value: -1, label: 'None' },
          { value: 1, label: 'Home' },
          { value: 2, label: 'Away' },
        ]))
      test('GameType is 24', () =>
        expect(getScoringMatchOptions(24)).toEqual([
          { value: 0, label: 'Unscored/To Reset' },
          { value: -1, label: 'None' },
          { value: 1, label: 'Home' },
          { value: 2, label: 'Away' },
        ]))
    })
    test('GameType is 25', () => {
      expect(getScoringMatchOptions(25)).toEqual([
        { value: 0, label: 'Unscored/To Reset' },
        { value: 1, label: '27th Minute Onwards' },
        { value: 2, label: 'Up To And Including The 26th Minute' },
        { value: 3, label: 'No Goal' },
      ])
    })
    test('GameType is 26', () => {
      expect(getScoringMatchOptions(26)).toEqual([
        { value: '0', label: 'Unscored/To Reset' },
        { value: '0-0', label: 'None' },
        { value: '1-0', label: 'Home' },
        { value: '0-1', label: 'Away' },
        { value: '1-1', label: 'Both' },
      ])
    })
    test('GameType is 27', () => {
      expect(getScoringMatchOptions(27)).toEqual([
        { value: 0, label: 'Unscored/To Reset' },
        { value: 1, label: '1 Minute' },
        { value: 2, label: '2 Minute' },
        { value: 3, label: '3 Minute' },
        { value: 4, label: '4 Minute' },
        { value: 5, label: '5 Minute or More' },
        { value: 6, label: 'None' },
      ])
    })
    test('GameType is 33', () => {
      expect(getScoringMatchOptions(33)).toEqual([
        { value: 0, label: 'Unscored/To Reset' },
        { value: 1, label: 'Home' },
        { value: 2, label: 'Away' },
      ])
    })
    test('GameType is 35', () => {
      expect(getScoringMatchOptions(35)).toEqual([
        { value: 0, label: 'Unscored/To Reset' },
        { value: 1, label: 'Any Goal Score Draw' },
        { value: 2, label: 'Home Team To Win By 1 Goal' },
        { value: 3, label: 'Home Team To Win By 2 Goals' },
        { value: 4, label: 'Home Team To Win By 3 Goals' },
        { value: 5, label: 'Home Team To Win By 4 or More Goals' },
        { value: 6, label: 'Away Team To Win By 1 Goal' },
        { value: 7, label: 'Away Team To Win By 2 Goals' },
        { value: 8, label: 'Away Team To Win By 3 Goals' },
        { value: 9, label: 'Away Team To Win By 4 Goals' },
        { value: 10, label: 'No Goal' },
      ])
    })
    test('GameType is null', () => {
      expect(getScoringMatchOptions(null)).toEqual([])
    })
  })
  describe('getCancelMatchOptions', () => {
    test('GameType is 20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49', () => {
      const gameTypes = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 
        33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49] // prettier-ignore
      gameTypes.forEach(e => {
        const result = getCancelMatchOptions(e)
        expect(result).toEqual([
          { source: 'N^', value: 'RESET', label: 'Uncancelled/To Reset' },
          { source: 'Y', value: 'GAMETYPE', label: 'Per GameType' },
          { source: 'N', value: 'CHOICE', label: 'Per Choice' },
        ])
      })
    })
    test('GameType is 50, 1101, 1104, 1107, 1110, 1113', () => {
      const gameTypes = [50, 1101, 1104, 1107, 1110, 1113] // prettier-ignore
      gameTypes.forEach(e => {
        const result = getCancelMatchOptions(e)
        expect(result).toEqual([
          { source: 'N^', value: 'RESET', label: 'Uncancelled/To Reset' },
          { source: 'Y', value: 'GAMETYPE', label: 'Per GameType' },
        ])
      })
    })
    test('GameType is NULL', () => {
      expect(getCancelMatchOptions(null)).toEqual([])
    })
  })
})
