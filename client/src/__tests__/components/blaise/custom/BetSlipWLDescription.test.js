import React from 'react'
import { BetSlipWLDescription } from 'components/blaise'
import { render, screen } from '__tests__/test-utils'

describe('BetSlipWLDescription', () => {
  describe('Render', () => {
    test('Game Type is Outright', () => {
      const record = {
        game_type: 11,
        home_name: 'Conor McGregor',
        league_name: 'UFC 202',
      }
      render(<BetSlipWLDescription {...record} />)
      const home_name = screen.getByText('Conor McGregor')
      const gameType = screen.getByText('Outright')
      const league_name = screen.getByText('UFC 202')
      expect(home_name).toBeInTheDocument()
      expect(gameType).toBeInTheDocument()
      expect(league_name).toBeInTheDocument()
    })
    test('Game Type is BetBuilder', () => {
      const record = {
        game_type: 3000,
        bet_builder_market: 'Conor McGregor And Nate Diaz And Kratos',
      }
      render(<BetSlipWLDescription {...record} />)
      const gameType = screen.getByText('Bet Builder')
      const bet_builder_market = screen.getByText('Conor McGregor And Nate Diaz And Kratos')
      expect(gameType).toBeInTheDocument()
      expect(bet_builder_market).toBeInTheDocument()
    })
    describe('FIRST', () => {
      describe('Choice Classname', () => {
        test('Game Type is AH OR G.AH AND Handicap is more than 0', () => {
          const record = {
            bet_choice: '1H',
            home_name: 'Conor McGregor',
            away_name: 'Nate Diaz',
            game_type: 0,
            m_game_type: 0,
            handicap: 1,
          }
          render(<BetSlipWLDescription {...record} />)
          const choice = screen.getByText('(H)Conor McGregor')
          expect(choice).toHaveClass('font-weight-bold text-black')
        })
        test('Game Type is AH OR G.AH AND Handicap is less than 0', () => {
          const record = {
            bet_choice: '1H',
            home_name: 'Conor McGregor',
            away_name: 'Nate Diaz',
            game_type: 0,
            m_game_type: 0,
            handicap: -1,
          }
          render(<BetSlipWLDescription {...record} />)
          const choice = screen.getByText('(H)Conor McGregor')
          expect(choice).toHaveClass('font-weight-bold text-red')
        })
      })
      // test('Game Type is not Mix Parlay', () => {
      //   const record = {
      //     game_type: 0,
      //     m_game_type: 0,
      //     handicap: 0.5,
      //     bet_choice: '1H',
      //     home_name: 'Conor McGregor',
      //     away_name: 'Nate Diaz',
      //     m_odds: 0.255,
      //     bet_live_status: 'Y',
      //     bet_score_home: 2,
      //     bet_score_away: 3,
      //     bet_builder_market: 'Conor McGregor And Nate Diaz And Kratos',
      //   }
      //   render(<BetSlipWLDescription {...record} />)
      //   const choice = screen.getByText('(H)Conor McGregor')
      //   const handicap = screen.getByText('0.50')
      //   const BETSCORE = screen.getByText('(2-3)')
      //   expect(choice).toBeInTheDocument()
      //   expect(handicap).toBeInTheDocument()
      //   expect(BETSCORE).toBeInTheDocument()
      //   expect(choice).toHaveClass('font-weight-bold text-black')
      // })
      test('Game Type is Mix Parlay', () => {
        const record = {
          game_type: -1,
          m_game_type: 0,
          handicap: 0.5,
          bet_choice: '1H',
          home_name: 'Conor McGregor',
          away_name: 'Nate Diaz',
          m_odds: 0.255,
          bet_live_status: 'Y',
          bet_score_home: 2,
          bet_score_away: 3,
          bet_builder_market: 'Conor McGregor And Nate Diaz And Kratos',
        }
        render(<BetSlipWLDescription {...record} />)
        const choice = screen.getByText('(H)Conor McGregor')
        const handicap = screen.getByText('0.50')
        const ODDS = screen.getByText('@ 0.26')
        expect(choice).toBeInTheDocument()
        expect(handicap).toBeInTheDocument()
        expect(ODDS).toBeInTheDocument()
        expect(choice).toHaveClass('font-weight-bold text-black')
      })
      // test('GameType is not included in any condition', () => {
      //   const record = {
      //     game_type: -1,
      //     m_game_type: -2,
      //     handicap: 0.5,
      //     bet_choice: '1H',
      //     home_name: 'Conor McGregor',
      //     away_name: 'Nate Diaz',
      //   }
      //   render(<BetSlipWLDescription {...record} />)
      //   const choice = screen.getAllByText('Conor McGregor')[0]
      //   expect(choice).toBeInTheDocument()
      // })
    })
    test('GAMETYPE', () => {
      render(<BetSlipWLDescription m_game_type={0} />)
      const gameTypeDescription = screen.getByText('Handicap')
      expect(gameTypeDescription).toBeInTheDocument()
    })
    describe('THIRD', () => {
      test('FGLG Home', () => {
        const record = {
          game_type: 14,
          first_goal: -1,
          last_goal: -1,
          home_name: 'Conor McGregor',
          away_name: 'Nate Diaz',
        }
        const renderResult = render(<BetSlipWLDescription {...record} />)
        const home_name = screen.getByText('Conor McGregor')
        const away_name = screen.getByText('Nate Diaz')
        const className = renderResult.container.querySelectorAll('INSERT IMAGE')
        expect(home_name).toBeInTheDocument()
        expect(away_name).toBeInTheDocument()
        className.forEach(element => {
          expect(element).toHaveClass('INSERT IMAGE')
        })
      })
      test('FGLG Away', () => {
        const record = {
          game_type: 14,
          first_goal: 1,
          last_goal: 1,
          home_name: 'Conor McGregor',
          away_name: 'Nate Diaz',
        }
        const renderResult = render(<BetSlipWLDescription {...record} />)
        const home_name = screen.getByText('Conor McGregor')
        const away_name = screen.getByText('Nate Diaz')
        const className = renderResult.container.querySelectorAll('INSERT IMAGE')
        expect(home_name).toBeInTheDocument()
        expect(away_name).toBeInTheDocument()
        className.forEach(element => {
          expect(element).toHaveClass('INSERT IMAGE')
        })
      })
      test('FGLG Default', () => {
        const record = {
          game_type: 14,
          first_goal: 0,
          last_goal: 0,
          home_name: 'Conor McGregor',
          away_name: 'Nate Diaz',
        }
        render(<BetSlipWLDescription {...record} />)
        const home_name = screen.getByText('Conor McGregor')
        const away_name = screen.getByText('Nate Diaz')
        expect(home_name).toBeInTheDocument()
        expect(away_name).toBeInTheDocument()
      })
    })
    test('LEAGUE', () => {
      const record = {
        sport_name: 'Mixed Martial Arts',
        league_name: 'UFC 202',
      }
      render(<BetSlipWLDescription {...record} />)
      const sport_name = screen.getByText('Mixed Martial Arts')
      const league_name = screen.getByText('UFC 202')
      expect(sport_name).toBeInTheDocument()
      expect(league_name).toBeInTheDocument()
    })
  })
})
