import React from 'react'
import { HDPColumn, getHDCDisplay, getHDCDisplay3WH } from 'components/blaise'
import { render, screen } from '__tests__/test-utils'

describe('HDPDisplay', () => {
  describe('HDPDColumn', () => {
    describe('ChoiceNameBTI is not NULL', () => {
      test('Handicap is not 0', () => {
        const record = {
          choice_name_bti: 'UFC 202',
          bet_choice: '2H',
          handicap: 1,
          bet_fav_status: 1,
        }
        render(<HDPColumn {...record} />)
        const title = screen.getByTitle('UFC 202')
        const handicapDisplay = screen.getByText('1.00')
        expect(title).toBeInTheDocument()
        expect(handicapDisplay).toBeInTheDocument()
        expect(handicapDisplay).toHaveClass('text-reset')
      })
      test('Handicap is 0', () => {
        const record = {
          choice_name_bti: 'UFC 202',
          bet_choice: '2H',
          handicap: 0,
          bet_fav_status: 1,
        }
        render(<HDPColumn {...record} />)
        const handicapDisplay = screen.getByText('...')
        expect(handicapDisplay).toBeInTheDocument()
      })
    })
    describe('ChoiceNameBTI is NULL', () => {
      test('GameType is not Handicap or Over/Under', () => {
        const record = {
          bet_choice: '2H',
          home_name: 'Conor McGregor',
          away_name: 'Nate Diaz',
          handicap: 1,
          bet_fav_status: 1,
          game_type: 60,
        }
        render(<HDPColumn {...record} />)
        const title = screen.getByTitle('(H)Conor McGregor')
        const handicapDisplay = screen.getByText('H')
        expect(title).toBeInTheDocument()
        expect(handicapDisplay).toBeInTheDocument()
      })
      describe('GameType is Handicap or Over/Under', () => {
        test('BetChoice is H and BetFavStatus is -1', () => {
          const record = {
            bet_choice: '2H',
            home_name: 'Conor McGregor',
            away_name: 'Nate Diaz',
            handicap: 1,
            bet_fav_status: -1,
            game_type: 0,
          }
          render(<HDPColumn {...record} />)
          const title = screen.getByTitle('(H)Conor McGregor')
          const handicapDisplay = screen.getByText('1')
          expect(title).toBeInTheDocument()
          expect(handicapDisplay).toBeInTheDocument()
          expect(handicapDisplay).toHaveClass('text-red')
        })
        test('BetChoice is A and BetFavStatus is 1', () => {
          const record = {
            bet_choice: '1A',
            home_name: 'Conor McGregor',
            away_name: 'Nate Diaz',
            handicap: 1,
            bet_fav_status: 1,
            game_type: 0,
          }
          render(<HDPColumn {...record} />)
          const title = screen.getByTitle('(A)Nate Diaz')
          const handicapDisplay = screen.getByText('1')
          expect(title).toBeInTheDocument()
          expect(handicapDisplay).toBeInTheDocument()
          expect(handicapDisplay).toHaveClass('text-red')
        })
        test('BetChoice is O', () => {
          const record = {
            bet_choice: '1O',
            home_name: 'Conor McGregor',
            away_name: 'Nate Diaz',
            handicap: 1,
            bet_fav_status: 1,
            game_type: 0,
          }
          render(<HDPColumn {...record} />)
          const title = screen.getByTitle('Over')
          const handicapDisplay = screen.getByText('1')
          expect(title).toBeInTheDocument()
          expect(handicapDisplay).toBeInTheDocument()
          expect(handicapDisplay).toHaveClass('text-red')
        })
        test('BetChoice is H and BetFavStatus is 1', () => {
          const record = {
            bet_choice: '2H',
            home_name: 'Conor McGregor',
            away_name: 'Nate Diaz',
            handicap: 1,
            bet_fav_status: 1,
            game_type: 0,
          }
          render(<HDPColumn {...record} />)
          const title = screen.getByTitle('(H)Conor McGregor')
          const handicapDisplay = screen.getByText('1')
          expect(title).toBeInTheDocument()
          expect(handicapDisplay).toBeInTheDocument()
          expect(handicapDisplay).toHaveClass('text-blue')
        })
        test('BetChoice is A and BetFavStatus is -1', () => {
          const record = {
            bet_choice: '1A',
            home_name: 'Conor McGregor',
            away_name: 'Nate Diaz',
            handicap: 1,
            bet_fav_status: -1,
            game_type: 0,
          }
          render(<HDPColumn {...record} />)
          const title = screen.getByTitle('(A)Nate Diaz')
          const handicapDisplay = screen.getByText('1')
          expect(title).toBeInTheDocument()
          expect(handicapDisplay).toBeInTheDocument()
          expect(handicapDisplay).toHaveClass('text-blue')
        })
        test('BetChoice is U', () => {
          const record = {
            bet_choice: '1U',
            home_name: 'Conor McGregor',
            away_name: 'Nate Diaz',
            handicap: 1,
            bet_fav_status: -1,
            game_type: 0,
          }
          render(<HDPColumn {...record} />)
          const title = screen.getByTitle('Under')
          const handicapDisplay = screen.getByText('1')
          expect(title).toBeInTheDocument()
          expect(handicapDisplay).toBeInTheDocument()
          expect(handicapDisplay).toHaveClass('text-blue')
        })
        test('BetChoice and BetFavStatus is undefined', () => {
          const record = {
            handicap: 1,
            bet_fav_status: -1,
            game_type: 0,
          }
          render(<HDPColumn {...record} />)
          const handicapDisplay = screen.getByText('1')
          expect(handicapDisplay).toBeInTheDocument()
          expect(handicapDisplay).toHaveClass('text-reset')
        })
      })
    })
    // test('game_type is not in List GTAH and GTOU', () => {
    //   render(<HDPColumn game_type={28} bet_choice="2H" handicap={0.125} bet_fav_status={1} />)
    //   const handicapDisplay = screen.getByText('H')
    //   expect(handicapDisplay).toBeInTheDocument()
    // })
    // describe('choice_name_bti is Exist', () => {
    //   test('Handicap is not 0', () => {
    //     render(
    //       <HDPColumn
    //         handicap={0.125}
    //         bet_choice="2H"
    //         bet_fav_status={-1}
    //         choice_name_bti="Conor McGregor"
    //       />,
    //     )
    //     const handicapDisplay = screen.getByText('0.13')
    //     const title = screen.getByTitle('Conor McGregor')
    //     expect(handicapDisplay).toBeInTheDocument()
    //     expect(title).toBeInTheDocument()
    //   })
    //   test('Handicap is 0', () => {
    //     render(
    //       <HDPColumn
    //         handicap={0}
    //         bet_choice="2H"
    //         bet_fav_status={-1}
    //         choice_name_bti="Conor McGregor"
    //       />,
    //     )
    //     const content = screen.getByText('...')
    //     const title = screen.getByTitle('Conor McGregor')
    //     expect(content).toBeInTheDocument()
    //     expect(title).toBeInTheDocument()
    //   })
    // })
  })
  // describe('HDPDisplay condition', () => {
  //   test('arrChoiceHomeHDP && bet_fav_status === -1', () => {
  //     const record = {
  //       handicap: 0.125,
  //       bet_choice: '2H',
  //       bet_fav_status: -1,
  //     }
  //     render(<HDPDisplay record={record} />)
  //     const handicapDisplay = screen.getByText('0/0.25')
  //     expect(handicapDisplay).toBeInTheDocument()
  //     expect(handicapDisplay).toHaveClass('text-red')
  //   })
  // test('arrChoiceAwayHDP && bet_fav_status !== 1', () => {
  //   render(<HDPDisplay handicap={0.125} bet_choice="2H" bet_fav_status={-1} />)
  //   const handicapDisplay = screen.getByText('0/0.25')
  //   expect(handicapDisplay).toBeInTheDocument()
  //   expect(handicapDisplay).toHaveClass('text-red')
  // })
  // test('arrChoiceOver', () => {
  //   render(<HDPDisplay handicap={0.125} bet_choice="2O" bet_fav_status={1} />)
  //   const handicapDisplay = screen.getByText('0/0.25')
  //   expect(handicapDisplay).toBeInTheDocument()
  //   expect(handicapDisplay).toHaveClass('text-red')
  // })
  // test('arrChoiceHomeHDP && bet_fav_status !== -1', () => {
  //   render(<HDPDisplay handicap={0.125} bet_choice="2A" bet_fav_status={1} />)
  //   const handicapDisplay = screen.getByText('0/0.25')
  //   expect(handicapDisplay).toBeInTheDocument()
  //   expect(handicapDisplay).toHaveClass('text-red')
  // })
  // test('arrChoiceAwayHDP && bet_fav_status === -1', () => {
  //   render(<HDPDisplay handicap={0.125} bet_choice="2A" bet_fav_status={-1} />)
  //   const handicapDisplay = screen.getByText('0/0.25')
  //   expect(handicapDisplay).toBeInTheDocument()
  //   expect(handicapDisplay).toHaveClass('text-blue')
  // })
  // test('arrChoiceUnder && bet_fav_status === -1', () => {
  //   render(<HDPDisplay handicap={0.125} bet_choice="2U" bet_fav_status={-1} />)
  //   const handicapDisplay = screen.getByText('0/0.25')
  //   expect(handicapDisplay).toBeInTheDocument()
  //   expect(handicapDisplay).toHaveClass('text-blue')
  // })
  // test('Empty Bet Choice or Undiscovered Bet Choice', () => {
  //   render(<HDPDisplay handicap={0.125} bet_choice="LALA" bet_fav_status={-1} />)
  //   const handicapDisplay = screen.getByText('0/0.25')
  //   expect(handicapDisplay).toBeInTheDocument()
  //   expect(handicapDisplay).toHaveClass('text-reset')
  // })
  // })
  test('get3WH_HDCDisplay', () => {
    expect(getHDCDisplay3WH('3WHH', 0)).toBe('(+0)')
    expect(getHDCDisplay3WH('3WHH', -1)).toBe('(-1)')
    expect(getHDCDisplay3WH('3WHD', 0)).toBe('(H+0)')
    expect(getHDCDisplay3WH('3WHD', -1)).toBe('(A+1)')
    expect(getHDCDisplay3WH('3WHA', -1)).toBe('(+1)')
    expect(getHDCDisplay3WH('3WHA', 2)).toBe('(-2)')
    expect(getHDCDisplay3WH('', 2)).toBe(null)
  })
  test('HDCDisplay', () => {
    expect(getHDCDisplay(0)).toBe('0')
    expect(getHDCDisplay(0.125)).toBe('0/0.25')
    expect(getHDCDisplay(0.25)).toBe('0/0.5')
    expect(getHDCDisplay(0.5)).toBe('0.5')
    expect(getHDCDisplay(0.75)).toBe('0.5/1')
    expect(getHDCDisplay(1)).toBe('1')
    expect(getHDCDisplay(2)).toBe('2')
  })
})
