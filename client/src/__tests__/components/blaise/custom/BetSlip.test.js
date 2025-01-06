import React from 'react'
import { BetSlip, getBetScore, getBetSelection, getMatch } from 'components/blaise'
import { render, screen } from '__tests__/test-utils'

describe('BetSlip', () => {
  describe('GameType is Lottery', () => {
    test('LotteryLeagueName is NOT Exist', () => {
      const record = {
        game_type: 4000,
        parlay_game_type: 0,
        lottery_league_name: '',
        lottery_total_match: 3,
        lottery_jackpot_type: 'LOT',
      }
      const { container } = render(<BetSlip {...record} />)
      expect(container.firstChild).toBeNull()
    })
    test('LotteryLeagueName is Exist', () => {
      const record = {
        game_type: 4000,
        parlay_game_type: 0,
        lottery_league_name: 'UFC 202',
        lottery_total_match: 3,
        lottery_jackpot_type: 'LOT',
      }
      render(<BetSlip {...record} />)
      const result1 = screen.getByText('Jackpot Pools - UFC 202 - Pick 3 - Lottery')
      const result2 = screen.getByText('LOT')
      expect(result1).toBeInTheDocument()
      expect(result2).toBeInTheDocument()
    })
  })
  test('GameType is Outright', () => {
    const record = {
      game_type: 11,
      home_name: 'Conor McGregor',
      odds: 2,
      sport_name: 'Mixed Martial Arts',
      league_name: 'UFC 202',
    }
    render(<BetSlip {...record} />)
    const sportName = screen.getByText('(Mixed Martial Arts)')
    const leagueName = screen.getByText('UFC 202')
    const homeName = screen.getByText('Conor McGregor')
    const odds = screen.getByText('2.00')
    expect(sportName).toBeInTheDocument()
    expect(leagueName).toBeInTheDocument()
    expect(homeName).toBeInTheDocument()
    expect(odds).toBeInTheDocument()
    expect(leagueName).toHaveClass('text-blue text-decoration-underline')
    expect(homeName).toHaveClass('text-maroon')
    expect(odds).toHaveClass('text-red')
  })
  test('GameType is BetBuilder OR Virtual Sport', () => {
    const record = {
      game_type: 3000,
      bet_builder_market: 'Jose Aldo And Nate Diaz And Dustin Porier',
      home_name: 'Conor McGregor',
      away_name: 'Nate Diaz',
    }
    render(<BetSlip {...record} />)
    const gameType = screen.getByText('Bet Builder')
    const homeAwayName = screen.getByText('Conor McGregor vs Nate Diaz')
    const betBuilder1 = screen.getByText('Jose Aldo')
    const betBuilder2 = screen.getByText('Nate Diaz')
    const betBuilder3 = screen.getByText('Dustin Porier')
    expect(gameType).toBeInTheDocument()
    expect(homeAwayName).toBeInTheDocument()
    expect(betBuilder1).toBeInTheDocument()
    expect(betBuilder2).toBeInTheDocument()
    expect(betBuilder3).toBeInTheDocument()
  })
  test('Render LeagueMulti', () => {
    const record = { game_type: -1, parlay_game_type: 0 }
    render(<BetSlip {...record} />)
    const result = screen.getByText('Handicap')
    expect(result).toBeInTheDocument()
  })
  test('Render BetSlip', () => {
    const record = {
      home_name: 'Conor McGregor',
      away_name: 'Nate Diaz',
      sport_name: 'Mixed Martial Arts',
      league_name: 'UFC 202',
      game_type: 0,
      parlay_game_type: 0,
      ft_score_status: 'Y',
      fs_home: 2,
      fs_away: 2,
      bet_fav_status: -1,
      handicap: 1,
      bet_choice: '1H',
      odds: 2,
      bet_live_status: 'Y',
      bet_score_home: 1,
      bet_score_away: 1,
    }
    render(<BetSlip {...record} />)
    const sportName = screen.getByText('(Mixed Martial Arts)')
    const leagueName = screen.getByText('UFC 202')
    const homeName = screen.getByText('Conor McGregor')
    const awayName = screen.getByText('Nate Diaz')
    const handicapDisplay = screen.getByText('1')
    const finalScore = screen.getByText('(2-2)')
    const betScore = screen.getByText('(1-1)')
    const betChoice = screen.getByText('(H)Conor McGregor')
    const odds = screen.getByText('@ 2.00')
    expect(sportName).toBeInTheDocument()
    expect(leagueName).toBeInTheDocument()
    expect(homeName).toBeInTheDocument()
    expect(awayName).toBeInTheDocument()
    expect(handicapDisplay).toBeInTheDocument()
    expect(finalScore).toBeInTheDocument()
    expect(betScore).toBeInTheDocument()
    expect(betChoice).toBeInTheDocument()
    expect(odds).toBeInTheDocument()
    expect(homeName).toHaveClass('text-red')
    expect(handicapDisplay).toHaveClass('text-maroon text-bold')
    expect(finalScore).toHaveClass('text-green')
    expect(betScore).toHaveClass('text-blue')
    expect(betChoice).toHaveClass('text-brown')
    expect(odds).toHaveClass('text-red')
  })
})

describe('getMatch', () => {
  test('GameType is 4000', () => {
    const record = {
      game_type: 4000,
      lottery_total_match: 3,
      lottery_league_name: 'UFC 202',
    }
    expect(getMatch(record, false)).toBe('Jackpot Pools - UFC 202 - Pick 3 - Lottery')
  })
  describe('Render home_name & away_name', () => {
    describe('GameType is ListGTHandicap', () => {
      test('betFavStatus is -1', () => {
        const record = {
          game_type: 0,
          bet_fav_status: -1,
          home_name: 'Conor McGregor',
        }
        render(getMatch(record, false))
        const homeName = screen.getByText('Conor McGregor')
        expect(homeName).toBeInTheDocument()
        expect(homeName).toHaveClass('text-red')
      })
      test('betFavStatus is 1', () => {
        const record = {
          game_type: 0,
          bet_fav_status: 1,
          away_name: 'Nate Diaz',
        }
        render(getMatch(record, false))
        const awayName = screen.getByText('Nate Diaz')
        expect(awayName).toBeInTheDocument()
        expect(awayName).toHaveClass('text-red')
      })
    })
  })
  describe('Render handicapDisplay', () => {
    test('GameType is ListGTHandicap', () => {
      const record = {
        game_type: 0,
        handicap: 1,
      }
      render(getMatch(record, false))
      const handicapDisplay = screen.getByText('1')
      expect(handicapDisplay).toBeInTheDocument()
      expect(handicapDisplay).toHaveClass('text-maroon text-bold')
    })
    test('GameType is not ListGTHandicap', () => {
      const record = {
        game_type: 28,
        handicap: 1,
      }
      render(getMatch(record, false))
      const handicapDisplay = screen.getByText('vs')
      expect(handicapDisplay).toBeInTheDocument()
      expect(handicapDisplay).toHaveClass('text-blue')
    })
  })
  describe('Render FINALSCORE', () => {
    test('GameType is [2, 6, 16, 8, 36, 13, 17, 1002] AND HTScoreStatus is Y', () => {
      const record = {
        game_type: 2,
        parlay_game_type: 0,
        ht_score_status: 'Y',
        ht_home: 1,
        ht_away: 1,
      }
      render(getMatch(record, false))
      const finalScore = screen.getByText('(1-1)')
      expect(finalScore).toBeInTheDocument()
      expect(finalScore).toHaveClass('text-green')
    })
    test('FTScoreStatus is Y', () => {
      const record = {
        game_type: 0,
        parlay_game_type: 0,
        ft_score_status: 'Y',
        fs_home: 2,
        fs_away: 2,
      }
      render(getMatch(record, false))
      const finalScore = screen.getByText('(2-2)')
      expect(finalScore).toBeInTheDocument()
      expect(finalScore).toHaveClass('text-green')
    })
  })
  test('TextOnly', () => {
    const record = {
      game_type: 0,
      bet_neutral_status: 'Y',
      ft_score_status: 'Y',
      home_name: 'Conor McGregor',
      away_name: 'Nate Diaz',
      handicap: 1,
      fs_home: 1,
      fs_away: 1,
    }
    expect(getMatch(record, true)).toBe('(N)  Conor McGregor 1 Nate Diaz (1-1)')
  })
  test('GameType is Mix Parlay', () => {
    const record = {
      game_type: -1,
      parlay_game_type: 0,
      bet_neutral_status: 'Y',
      ft_score_status: 'Y',
      home_name: 'Conor McGregor',
      away_name: 'Nate Diaz',
      handicap: 1,
      fs_home: 1,
      fs_away: 1,
    }
    expect(getMatch(record, true)).toBe('(N)  Conor McGregor 1 Nate Diaz (1-1)')
  })
})
describe('getBetSelection', () => {
  test('GameType is 4000', () => {
    const record = {
      game_type: 4000,
    }
    expect(getBetSelection(record, false)).toBe('')
  })
  describe('GameType is ListGTHandicap', () => {
    const record = {
      game_type: 0,
      parlay_game_type: 0,
      handicap: 1,
      bet_choice: '1H',
      home_name: 'Conor McGregor',
      away_name: 'Nate Diaz',
      odds: 2,
      bet_fav_status: -1,
      bet_live_status: 'Y',
      bet_score_home: 1,
      bet_score_away: 1,
    }
    test('textOnly is false', () => {
      render(getBetSelection(record, false))
      const betScore = screen.getByText('(1-1)')
      const betChoice = screen.getByText('(H)Conor McGregor')
      const odds = screen.getByText('@ 2.00')
      expect(betScore).toBeInTheDocument()
      expect(betChoice).toBeInTheDocument()
      expect(odds).toBeInTheDocument()
      expect(betScore).toHaveClass('text-blue')
      expect(betChoice).toHaveClass('text-brown')
      expect(odds).toHaveClass('text-red')
    })
    describe('textOnly is true', () => {
      test('Sign is Minus', () => {
        render(getBetSelection({ ...record, bet_fav_status: -1 }, true))
        const result = screen.getByText('(1-1) (H)Conor McGregor -1 @ 2.00')
        expect(result).toBeInTheDocument()
      })
      test('Sign is Plus', () => {
        render(getBetSelection({ ...record, bet_fav_status: 1 }, true))
        const result = screen.getByText('(1-1) (H)Conor McGregor +1 @ 2.00')
        expect(result).toBeInTheDocument()
      })
      test('Sign is Empty', () => {
        render(getBetSelection({ ...record, bet_fav_status: 0 }, true))
        const result = screen.getByText('(1-1) (H)Conor McGregor 1 @ 2.00')
        expect(result).toBeInTheDocument()
      })
    })
  })
  test('GameType is Mix Parlay', () => {
    const record = {
      game_type: -1,
      parlay_game_type: 5,
      handicap: 1,
      bet_choice: '1H',
      home_name: 'Conor McGregor',
      away_name: 'Nate Diaz',
      odds: 2,
      bet_fav_status: -1,
      bet_live_status: 'Y',
      bet_score_home: 1,
      bet_score_away: 1,
    }
    render(getBetSelection(record, false))
    const betScore = screen.getByText('(1-1)')
    const betChoice = screen.getByText('(H)Conor McGregor 1')
    const odds = screen.getByText('@ 2.00')
    expect(betScore).toBeInTheDocument()
    expect(betChoice).toBeInTheDocument()
    expect(odds).toBeInTheDocument()
    expect(betScore).toHaveClass('text-blue')
    expect(betChoice).toHaveClass('text-brown')
    expect(odds).toHaveClass('text-red')
  })
  test('GameType is ListGTOverUnder', () => {
    const record = {
      game_type: 5,
      parlay_game_type: 0,
      handicap: 1,
      bet_choice: '1H',
      home_name: 'Conor McGregor',
      away_name: 'Nate Diaz',
      odds: 2,
      bet_fav_status: -1,
      bet_live_status: 'Y',
      bet_score_home: 1,
      bet_score_away: 1,
    }
    render(getBetSelection(record, false))
    const betScore = screen.getByText('(1-1)')
    const betChoice = screen.getByText('(H)Conor McGregor 1')
    const odds = screen.getByText('@ 2.00')
    expect(betScore).toBeInTheDocument()
    expect(betChoice).toBeInTheDocument()
    expect(odds).toBeInTheDocument()
    expect(betScore).toHaveClass('text-blue')
    expect(betChoice).toHaveClass('text-brown')
    expect(odds).toHaveClass('text-red')
  })
  test('GameType is ListGTOddEven, ListGT1X2, NGNC, WNW, [1001, 1002, 7, 9, 15, 20, 28]', () => {
    const record = {
      game_type: 3,
      parlay_game_type: 0,
      handicap: 1,
      bet_choice: '1H',
      home_name: 'Conor McGregor',
      away_name: 'Nate Diaz',
      odds: 2,
      bet_fav_status: -1,
      bet_live_status: 'Y',
      bet_score_home: 1,
      bet_score_away: 1,
    }
    render(getBetSelection(record, false))
    const betScore = screen.getByText('(1-1)')
    const betChoice = screen.getByText('(H)Conor McGregor')
    const odds = screen.getByText('@ 2.00')
    expect(betScore).toBeInTheDocument()
    expect(betChoice).toBeInTheDocument()
    expect(odds).toBeInTheDocument()
    expect(betScore).toHaveClass('text-blue')
    expect(betChoice).toHaveClass('text-brown')
    expect(odds).toHaveClass('text-red')
  })
  test('GameType is 3WH', () => {
    const record = {
      game_type: 39,
      parlay_game_type: 0,
      handicap: 1,
      bet_choice: '3WHH',
      home_name: 'Conor McGregor',
      away_name: 'Nate Diaz',
      odds: 2,
      bet_fav_status: -1,
      bet_live_status: 'Y',
      bet_score_home: 1,
      bet_score_away: 1,
    }
    render(getBetSelection(record, false))
    const betChoice = screen.getByText('(H)Conor McGregor')
    const handicapDisplay3WH = screen.getByText('(+1)')
    const odds = screen.getByText('@ 2.00')
    expect(betChoice).toBeInTheDocument()
    expect(handicapDisplay3WH).toBeInTheDocument()
    expect(odds).toBeInTheDocument()
    expect(betChoice).toHaveClass('text-blue')
    expect(handicapDisplay3WH).toHaveClass('text-brown')
    expect(odds).toHaveClass('text-red')
  })
  describe('ChoiceNameBTI', () => {
    const record = {
      game_type: 0,
      parlay_game_type: 0,
      handicap: 1,
      bet_choice: '1H',
      home_name: 'Conor McGregor',
      away_name: 'Nate Diaz',
      odds: 2,
      bet_fav_status: -1,
      bet_live_status: 'Y',
      bet_score_home: 1,
      bet_score_away: 1,
      choice_name_bti: 'CONOR MCGREGOR',
    }
    test('textOnly is false', () => {
      render(getBetSelection(record, false))
      const betChoice = screen.getByText('CONOR MCGREGOR')
      const odds = screen.getByText('@ 2.00')
      expect(betChoice).toBeInTheDocument()
      expect(odds).toBeInTheDocument()
      expect(betChoice).toHaveClass('text-brown')
      expect(odds).toHaveClass('text-red')
    })
    describe('textOnly is true', () => {
      test('Sign is Minus', () => {
        render(getBetSelection({ ...record, bet_fav_status: -1 }, true))
        const result = screen.getByText('CONOR MCGREGOR @ 2.00')
        expect(result).toBeInTheDocument()
      })
      test('Sign is Plus', () => {
        render(getBetSelection({ ...record, bet_fav_status: 1 }, true))
        const result = screen.getByText('CONOR MCGREGOR @ 2.00')
        expect(result).toBeInTheDocument()
      })
      test('Sign is Empty', () => {
        render(getBetSelection({ ...record, bet_fav_status: 0 }, true))
        const result = screen.getByText('CONOR MCGREGOR @ 2.00')
        expect(result).toBeInTheDocument()
      })
    })
  })
  test('GameType is not found', () => {
    const record = {
      game_type: 1110,
      parlay_game_type: 0,
      handicap: 1,
      bet_choice: '1H',
      home_name: 'Conor McGregor',
      away_name: 'Nate Diaz',
      odds: 2,
      bet_fav_status: -1,
      bet_live_status: 'Y',
      bet_score_home: 1,
      bet_score_away: 1,
    }
    render(getBetSelection(record, false))
    const betChoice = screen.getByText('(H)Conor McGregor')
    const odds = screen.getByText('@ 2.00')
    expect(betChoice).toBeInTheDocument()
    expect(odds).toBeInTheDocument()
    expect(betChoice).toHaveClass('text-brown')
    expect(odds).toHaveClass('text-red')
  })
})
describe('getBetScore', () => {
  describe('BetLiveStatus is Y', () => {
    const record = {
      game_type: -1,
      parlay_game_type: 1,
      bet_live_status: 'Y',
      bet_score_home: 1,
      bet_score_away: 0,
    }
    test('With Brackets', () => expect(getBetScore(record, true)).toBe('(1-0)'))
    test('Without Brackets', () => expect(getBetScore(record, false)).toBe('1-0'))
  })
  test('BetLiveStatus is N', () => {
    const record = {
      game_type: -1,
      parlay_game_type: 1,
      bet_live_status: 'N',
      bet_score_home: 1,
      bet_score_away: 0,
    }
    expect(getBetScore(record, true)).toBe('')
  })
  test('Empty Parameters', () => {
    expect(getBetScore()).toBeNull()
  })
})
