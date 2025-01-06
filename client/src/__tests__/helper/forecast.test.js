import {
  CountWL,
  CountWL_GT,
  GetScoreIndex,
  RoundMarginWL,
  RoundWL,
  GetGameTypeForecastLine,
  createHDPColumns,
  createOUColumns,
  getScore,
} from 'helper'

describe('forecast', () => {
  describe('CountWL_GT', () => {
    const record = {
      sport_id: 10,
      game_type: 0,
      handicap: 1,
      bet_score_home: 0,
      bet_score_away: 0,
      liab_home: 1,
      liab_away: 2,
      liab_draw: 3,
      liab4: 4,
      liab5: 5,
      liab6: 6,
      liab7: 7,
      liab8: 8,
      liab9: 9,
      ng_home: 0,
      ng_away: 0,
    }
    const arrScore = ['4-0', '3-0', '2-0', '1-0', '0-0', '0-1', '0-2', '0-3', '0-4', '0-0', '1-0', '0-1'] // prettier-ignore
    const arrScoreList = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    test('arrScoreList is empty', () => {
      expect(CountWL_GT(record, arrScore, [], false)).toEqual([1, 1, 1, 1, 1, 0, 2, 2, 2, 1, 1, 0])
    })
    describe('arrScoreList is not empty', () => {
      test('GameType is not CSL', () => {
        expect(CountWL_GT(record, arrScore, arrScoreList, false)).toEqual([2, 2, 2, 2, 2, 1, 3, 3, 3, 2, 2, 1]) // prettier-ignore
      })
      test('GameType is CSL', () => {
        expect(CountWL_GT({...record, game_type: 1001}, arrScore, arrScoreList, false)).toEqual([4, 4, 4, 4, 4, 3, 5, 5, 5, 3, 4, 3]) // prettier-ignore
      })
    })
  })
  describe('GetScore', () => {
    test(`GameType is ListGTForecastScoreHomeAwayFT, 
          ListGTForecastScoreTotalScoreFT, 
          ListGTForecastScoreHomeAwaySW, 
          ListGTForecastScoreTotalScoreSW`, () => {
      const record = { game_type: 0, fs_home: 1, fs_away: 0, ht_home: 3, ht_away: 2, gh_home: 1, gh_away: 2 } // prettier-ignore
      expect(getScore(record)).toEqual([1, 0])
    })
    test('GameType is ListGTForecastScoreHomeAwayFH, ListGTForecastScoreTotalScoreFH', () => {
      const record = { game_type: 2, fs_home: 1, fs_away: 0, ht_home: 3, ht_away: 2, gh_home: 1, gh_away: 2 } // prettier-ignore
      expect(getScore(record)).toEqual([3, 2])
    })
    test(`GameType is ListGTForecastScoreHomeAwayFH
          ListGTForecastScoreHomeAwayGAH
          ListGTForecastScoreTotalScoreGOU
          ListGTForecastScoreHomeAwaySG
          ListGTForecastScoreTotalScoreSG
          ListGTForecastScoreHomeAwayQ1
          ListGTForecastScoreTotalScoreQ1
          ListGTForecastScoreHomeAwayQ2
          ListGTForecastScoreTotalScoreQ2
          ListGTForecastScoreHomeAwayQ3
          ListGTForecastScoreTotalScoreQ3
          ListGTForecastScoreHomeAwayQ4
          ListGTForecastScoreTotalScoreQ4`, () => {
      const record = { game_type: 50, fs_home: 1, fs_away: 0, ht_home: 3, ht_away: 2, gh_home: 1, gh_away: 2 } // prettier-ignore
      expect(getScore(record)).toEqual([1, 2])
    })
    test('GameType is not found', () => {
      const record = { game_type: 4000, fs_home: 1, fs_away: 0, ht_home: 3, ht_away: 2, gh_home: 1, gh_away: 2 } // prettier-ignore
      expect(getScore(record)).toEqual([0, 0])
    })
  })
  describe('CountWL', () => {
    test('fav is not H', () => {
      const result = CountWL('0-1', 0, 0, 0, 0, 0, 0.875, 'A', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
      expect(result).toBe(1)
    })
    describe('GameType is ListGT Handicap OR SetWinner', () => {
      describe('Sport ID is not 19 (Golf)', () => {
        describe('Getting X', () => {
          test('A is 0.125', () => {
            const result = CountWL('0-1', 0, 0, 0, 0, 0, 0.875, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
            expect(result).toBe(0.5)
          })
          test('A is 0.25', () => {
            const result = CountWL('0-1', 0, 0, 0, 0, 0, 0.75, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
            expect(result).toBe(1)
          })
          test('A is more than 1', () => {
            const result = CountWL('0-1', 0, 0, 0, 0, 0, 0.25, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
            expect(result).toBe(2)
          })
          test('A is 0', () => {
            const result = CountWL('0-0', 0, 0, 0, 0, 0, 0, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
            expect(result).toBe(0)
          })
        })
        test('A is more than 0', () => {
          const result = CountWL('1-0', 0, 0, 0, 0, 0, 0.875, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(1)
        })
        test('A is less than 0', () => {
          const result = CountWL('0-1', 0, 0, 0, 0, 0, 0, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(2)
        })
      })
      describe('Sport ID is 19 (Golf)', () => {
        test('A is more than 0', () => {
          const result = CountWL('1-0', 0, 0, 0, 0, 0, 1, 'H', 19, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(2)
        })
        test('A is less than 0', () => {
          const result = CountWL('0-1', 0, 0, 0, 0, 0, 0, 'H', 19, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(1)
        })
      })
    })
    describe('GameType is OU', () => {
      describe('A is more than 0', () => {
        test('A is equal to 0.125', () => {
          const result = CountWL('1-0', 0, 0, 0, 0, 5, 0.875, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(0.25)
        })
        test('A is equal to 0.25', () => {
          const result = CountWL('1-0', 0, 0, 0, 0, 5, 0.75, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(0.5)
        })
        test('A is more than 0.25', () => {
          const result = CountWL('1-0', 0, 0, 0, 0, 5, 0.5, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(1)
        })
        test('A is equal to 0', () => {
          const result = CountWL('1-0', 0, 0, 0, 0, 5, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(0)
        })
      })
      test('A is less than 0', () => {
        const result = CountWL('0-0', 0, 0, 0, 0, 5, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(2)
      })
    })
    describe('GameType is OE', () => {
      test('X is 1', () => {
        const result = CountWL('1-0', 0, 0, 0, 0, 3, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(1)
      })
      test('X is not 1', () => {
        const result = CountWL('0-0', 0, 0, 0, 0, 3, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(2)
      })
    })
    describe('GameType is 4', () => {
      test('X is 1', () => {
        const result = CountWL('0-0', 0, 0, 0, 0, 4, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(1)
      })
      test('X is not 1', () => {
        const result = CountWL('1-0', 0, 0, 0, 0, 4, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(1)
      })
    })
    describe('GameType is 1X2, ML, AND [15, 28]', () => {
      test('ScoreHome is greater than ScoreAway', () => {
        const result = CountWL('1-0', 0, 0, 0, 0, 1, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(1)
      })
      test('ScoreHome is less than ScoreAway', () => {
        const result = CountWL('0-1', 0, 0, 0, 0, 1, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(2)
      })
      test('ScoreHome is equal to ScoreAway', () => {
        const result = CountWL('0-0', 0, 0, 0, 0, 1, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(3)
      })
      test('ScoreHome is string', () => {
        const result = CountWL('a-0', 0, 0, 0, 0, 1, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(0)
      })
    })
    describe('GameType is [59, 60]', () => {
      test('NGHome is 1 AND NGAway is 0', () => {
        const result = CountWL('0-0', 0, 0, 0, 0, 59, 1, 'H', 10, 1, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(1)
      })
      test('NGHome is 1 AND NGAway is 0', () => {
        const result = CountWL('0-0', 0, 0, 0, 0, 59, 1, 'H', 10, 0, 1, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(2)
      })
      describe('NG_Home is 0 && NG_Away is 0', () => {
        test('A is greater than 0', () => {
          const result = CountWL('1-0', 0, 0, 0, 0, 59, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(1)
        })
        test('A is less than 0', () => {
          const result = CountWL('0-1', 0, 0, 0, 0, 59, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(2)
        })
        test('A is 0', () => {
          const result = CountWL('0-0', 0, 0, 0, 0, 59, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(0)
        })
      })
    })
    describe('GameType is CSL', () => {
      describe('isForecastSingle is true', () => {
        test('Result is tHome', () => {
          const result = CountWL('1-1', 0, 0, 0, 1, 1001, 1, 'H', 10, 1, 1, true, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(1)
        })
        test('Result is tAway', () => {
          const result = CountWL('1-1', 0, 0, 0, 1, 1001, 1, 'H', 10, 1, 0, true, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(2)
        })
      })
      describe('isForecastSingle is false', () => {
        describe('currScoreHome is greater than currScoreAway', () => {
          test('ScoreHome is less than 0', () => {
            const result = CountWL('0-0', 0, 0, 1, 0, 1001, 1, 'H', 10, 1, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
            expect(result).toBe(2)
          })
          test('ScoreHome is more than currScoreHome - currScoreAway', () => {
            const result = CountWL('1-0', 0, 0, 1, 0, 1001, 1, 'H', 10, 1, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
            expect(result).toBe(1)
          })
          test('ScoreHome is more than currScoreHome - currScoreAway', () => {
            const result = CountWL('0-1', 0, 0, 1, 0, 1001, 1, 'H', 10, 1, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
            expect(result).toBe(2)
          })
        })
        describe('currScoreHome is less than currScoreAway', () => {
          test('ScoreHome is less than 0', () => {
            const result = CountWL('0-0', 0, 0, 0, 1, 1001, 1, 'H', 10, 0, 1, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
            expect(result).toBe(2)
          })
          test('targetScoreAway is more than currScoreAway - currScoreHome', () => {
            const result = CountWL('0-1', 0, 0, 0, 1, 1001, 1, 'H', 10, 0, 1, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
            expect(result).toBe(1)
          })
          test('targetScoreHome is more than 0', () => {
            const result = CountWL('1-0', 0, 0, 0, 1, 1001, 1, 'H', 10, 0, 1, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
            expect(result).toBe(2)
          })
        })
        test('curHome is equal to curAway', () => {
          const result = CountWL('1-0', 0, 0, 0, 0, 1001, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(2)
        })
      })
    })
    describe('GameType is 20', () => {
      test('Result is ScoreHome', () => {
        const result = CountWL('1-1', 0, 0, 1, 1, 20, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(1)
      })
      describe('Result is ScoreAway', () => {
        test('targetScoreAway is more than 0', () => {
          const result = CountWL('0-1', 0, 0, 0, 0, 20, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(2)
        })
        test('currScoreAway is more than 0', () => {
          const result = CountWL('0-0', 0, 0, 0, 1, 20, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(1)
        })
        test('targetScoreHome AND targetScoreAway is 0 && currScoreHome is more than 0', () => {
          const result = CountWL('0-0', 0, 0, 1, 0, 20, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(1)
        })
        test('Everything is 0', () => {
          const result = CountWL('0-0', 0, 0, 0, 0, 20, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
          expect(result).toBe(2)
        })
      })
    })
    describe('GameType is 7', () => {
      test('ScoreHome is 0 OR ScoreHome is 1', () => {
        const result = CountWL('1-0', 0, 0, 0, 0, 7, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(1)
      })
      test('ScoreHome is 2 OR ScoreHome is 3', () => {
        const result = CountWL('2-0', 0, 0, 0, 0, 7, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(2)
      })
      test('ScoreHome is more than 4 AND 6', () => {
        const result = CountWL('4-0', 0, 0, 0, 0, 7, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(3)
      })
      test('ScoreHome is more than 7', () => {
        const result = CountWL('7-0', 0, 0, 0, 0, 7, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(4)
      })
      test('ScoreHome is string', () => {
        const result = CountWL('a-0', 0, 0, 0, 0, 7, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(0)
      })
    })
    describe('GameType is 36', () => {
      test('ScoreHome is 0 OR ScoreHome is 1', () => {
        const result = CountWL('1-0', 0, 0, 0, 0, 36, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(1)
      })
      test('ScoreHome is 2 OR ScoreHome is 3', () => {
        const result = CountWL('2-0', 0, 0, 0, 0, 36, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(2)
      })
      test('ScoreHome is more than 4', () => {
        const result = CountWL('4-0', 0, 0, 0, 0, 36, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(3)
      })
      test('TargetScoreHome is string', () => {
        const result = CountWL('a-0', 0, 0, 0, 0, 36, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(0)
      })
    })
    describe('GameType is 9', () => {
      test('HT is 1 && FT is 1', () => {
        const result = CountWL('2-0', 0, 0, 0, 0, 9, 1, 'H', 10, 1, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(1)
      })
      test('HT is 1 && FT is 2', () => {
        const result = CountWL('1-0', 0, 0, 0, 0, 9, 1, 'H', 10, 1, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(2)
      })
      test('HT is 1 && FT is 3', () => {
        const result = CountWL('1-0', 0, 0, 0, 0, 9, 1, 'H', 10, 2, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(3)
      })
      test('HT is 1 && FT is 3', () => {
        const result = CountWL('1-0', 0, 0, 0, 0, 9, 1, 'H', 10, 2, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(3)
      })
      test('HT is 2 && FT is 1', () => {
        const result = CountWL('1-0', 0, 0, 0, 0, 9, 1, 'H', 10, 1, 1, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(4)
      })
      test('HT is 2 && FT is 2', () => {
        const result = CountWL('0-0', 0, 0, 0, 0, 9, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(5)
      })
      test('HT is 2 && FT is 3', () => {
        const result = CountWL('0-1', 0, 0, 0, 0, 9, 1, 'H', 10, 0, 0, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(6)
      })
      test('HT is 3 && FT is 1', () => {
        const result = CountWL('1-0', 0, 0, 0, 0, 9, 1, 'H', 10, 0, 1, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(7)
      })
      test('HT is 3 && FT is 2', () => {
        const result = CountWL('0-1', 0, 0, 0, 0, 9, 1, 'H', 10, 0, 1, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(8)
      })
      test('HT is 3 && FT is 3', () => {
        const result = CountWL('0-2', 0, 0, 0, 0, 9, 1, 'H', 10, 0, 1, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(9)
      })
      test('HT is 4 && FT is null', () => {
        const result = CountWL('0-2', 0, 0, 0, 0, 9, 1, 'H', 10, 'a', 1, false, 1, 2, 3, 4, 5, 6, 7, 8, 9) // prettier-ignore
        expect(result).toBe(0)
      })
    })
    describe('GameType is 63', () => {
      test('Score Home is bigger than Score Away', () => {
        const result = CountWL('1-0', 0, 0, 0, 0, 63, 1, 'H', 10, 0, 0, false, 1, 2, 3, 0, 0, 0, 0, 0, 0) // prettier-ignore
        expect(result).toBe(1)
      })
      test('Score Home is lower than Score Away', () => {
        const result = CountWL('0-1', 0, 0, 0, 0, 63, 1, 'H', 10, 0, 0, false, 1, 2, 3, 0, 0, 0, 0, 0, 0) // prettier-ignore
        expect(result).toBe(2)
      })
    })
    describe('GameType is 64', () => {
      test('Score Home is bigger than Score Away', () => {
        const result = CountWL('1-0', 0, 0, 0, 0, 64, 1, 'H', 10, 0, 0, false, 1, 2, 3, 0, 0, 0, 0, 0, 0) // prettier-ignore
        expect(result).toBe(2)
      })
      test('Score Home is lower than Score Away', () => {
        const result = CountWL('0-1', 0, 0, 0, 0, 64, 1, 'H', 10, 0, 0, false, 1, 2, 3, 0, 0, 0, 0, 0, 0) // prettier-ignore
        expect(result).toBe(1)
      })
    })
    test('GameType is not found', () => {
      const result = CountWL('1-0', 0, 0, 0, 0, 4000, 1, 'H', 10, 0, 0, false, 1, 2, 3, 0, 0, 0, 0, 0, 0) // prettier-ignore
      expect(result).toBe(0)
    })
  })
  describe('GetScoreIndex', () => {
    const record = { league_sequence: "0", league_name: "ENGLISH PREMIER LEAGUE", match_id: 6776371, 
    match_live_status: "Y", game_type: 5, handicap: 0.5, bet_score_home: 0, bet_score_away: 0, home_name: "Fulham", 
    away_name: "Sheffield United", t_home: 22.5, t_away: 0, t_draw: 0, liab_home: -10.8, liab_away: 22.5, 
    liab_draw: 0, fs_home: 0, fs_away: 0, ht_home: 0, ht_away: 0, ev_round: 0, trader: "", process_hs_date: null, process_date: null, 
    sport_id: 10, message: "", order_ah: null, order_ou: null, last_update: null, stamp_user: null, interval_trader_info: 0, 
    ng_home: 0, ng_away: 0, forecast_line: 1, gh_home: 0, gh_away: 0, league_sequence_parent: 200, 
    liab4: 0, liab5: 0, liab6: 0, liab7: 0, liab8: 0, liab9: 0 } // prettier-ignore
    const arrScoreHDP = ['4-0', '3-0', '2-0', '1-0', '0-0', '0-1', '0-2', '0-3', '0-4']
    const arrScoreOU = ['0', '1', '2', '3', '4', '5', '6', '7']
    test('matchLiveStatus is Y', () =>
      expect(GetScoreIndex(record, arrScoreHDP, arrScoreOU)).toEqual([4, 0]))
    test('matchLiveStatus is N', () =>
      expect(
        GetScoreIndex({ ...record, match_live_status: 'N' }, arrScoreHDP, arrScoreOU),
      ).toEqual([null, null]))
  })
  describe('RoundWL', () => {
    test('arrScoreList is NULL', () => expect(RoundWL([], 0, 0)).toEqual([null, null]))
    describe('arrScoreList is not NULL', () => {
      test('betAmount is not 0', () => {
        expect(
          RoundWL([ -9, -9, -9, -9, 0, 22.5, 22.5, 22.5, 22.5], 22.5, [])).toEqual([
          [-9, -9, -9, -9, 0, 22.5, 22.5, 22.5, 22.5],
          [-40, -40, -40, -40, 0, 100, 100, 100, 100],
        ])
      })
      test('betAmount is 0', () => {
        expect(
          RoundWL([ -9, -9, -9, -9, 0, 22.5, 22.5, 22.5, 22.5], 0, [])).toEqual([
          [-9, -9, -9, -9, 0, 22.5, 22.5, 22.5, 22.5],
          [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ])
      })
    }) // prettier-ignore
  })
  describe('RoundMarginWL', () => {
    test('betAmountHDP and betAmountOU are 0', () => expect(RoundMarginWL(10, 0, 0)).toBe(0))
    test('betAmountHDP and betAmountOU are not 0', () => expect(RoundMarginWL(10, 1, 1)).toBe(500))
  })
  describe('GetGameTypeForecastLine', () => {
    test('GameType is in ListGTForecastScoreHomeAwayFT', () => expect(GetGameTypeForecastLine(0)).toBe('FT')) // prettier-ignore
    test('GameType is in ListGTForecastScoreTotalScoreFT', () => expect(GetGameTypeForecastLine(5)).toBe('FT')) // prettier-ignore
    test('GameType is in ListGTForecastScoreHomeAwayFH', () => expect(GetGameTypeForecastLine(2)).toBe('1H')) // prettier-ignore
    test('GameType is in ListGTForecastScoreTotalScoreFH', () => expect(GetGameTypeForecastLine(6)).toBe('1H')) // prettier-ignore
    test('GameType is in ListGTForecastScoreHomeAwayGAH', () => expect(GetGameTypeForecastLine(50)).toBe('GH')) // prettier-ignore
    test('GameType is in ListGTForecastScoreTotalScoreGOU', () => expect(GetGameTypeForecastLine(61)).toBe('GH')) // prettier-ignore
    test('GameType is in ListGTForecastScoreHomeAwaySW', () => expect(GetGameTypeForecastLine(1101)).toBe('S1')) // prettier-ignore
    test('GameType is in ListGTForecastScoreHomeAwaySG', () => expect(GetGameTypeForecastLine(1105)).toBe('S2.GH')) // prettier-ignore
    test('GameType is in ListGTForecastScoreTotalScoreSG', () => expect(GetGameTypeForecastLine(1103)).toBe('S1.GH')) // prettier-ignore
    test('GameType is in ListGTForecastScoreHomeAwayQ1', () => expect(GetGameTypeForecastLine(1241)).toBe('Q1')) // prettier-ignore
    test('GameType is in ListGTForecastScoreTotalScoreQ1', () => expect(GetGameTypeForecastLine(1245)).toBe('Q1')) // prettier-ignore
    test('GameType is in ListGTForecastScoreHomeAwayQ2', () => expect(GetGameTypeForecastLine(1242)).toBe('Q2')) // prettier-ignore
    test('GameType is in ListGTForecastScoreTotalScoreQ2', () => expect(GetGameTypeForecastLine(1246)).toBe('Q2')) // prettier-ignore
    test('GameType is in ListGTForecastScoreHomeAwayQ3', () => expect(GetGameTypeForecastLine(1243)).toBe('Q3')) // prettier-ignore
    test('GameType is in ListGTForecastScoreTotalScoreQ3', () => expect(GetGameTypeForecastLine(1247)).toBe('Q3')) // prettier-ignore
    test('GameType is in ListGTForecastScoreHomeAwayQ4', () => expect(GetGameTypeForecastLine(1244)).toBe('Q4')) // prettier-ignore
    test('GameType is in ListGTForecastScoreTotalScoreQ4', () => expect(GetGameTypeForecastLine(1248)).toBe('Q4')) // prettier-ignore
    test('GameType is not found', () => expect(GetGameTypeForecastLine(-2)).toBe('')) // prettier-ignore
  })
  describe('createHDPColumns', () => {
    test('isForecastSingle is false', () =>
      expect(createHDPColumns(4, 4, 20, 20, false)).toEqual(['4-0','3-0','2-0','1-0','0-0','0-1','0-2','0-3','0-4'])) // prettier-ignore
    test('isForecastSingle is true', () =>
      expect(createHDPColumns(0, 7, 20, 20, true)).toEqual(['20-20','20-21','20-22','20-23','20-24','20-25','20-26','20-27'])) // prettier-ignore
  })
  describe('createOUColumns', () => {
    test('isForecastSingle is false', () =>
      expect(createOUColumns(0, 7, 20, 20, false)).toEqual(['0','1','2','3','4','5','6','7'])) // prettier-ignore
    test('isForecastSingle is true', () =>
      expect(createOUColumns(0, 7, 20, 20, true)).toEqual(['40','41','42','43','44','45','46','47'])) // prettier-ignore
  })
})
