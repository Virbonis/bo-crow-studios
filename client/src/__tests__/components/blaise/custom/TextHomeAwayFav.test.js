import React from 'react'
import { TextAwayFav, TextHomeFav } from 'components/blaise'
import { render, screen } from '__tests__/test-utils'

describe('TextHomeAwayFav', () => {
  describe('TextHomeFav', () => {
    const name = 'Conor McGregor'
    describe('GameType is AH OR GAH', () => {
      test('STFav is 1', () => {
        render(<TextHomeFav st_fav={-1} game_type={0} bet_choice="" home_name={name} />)
        const result = screen.getByText('Conor McGregor')
        expect(result).toBeInTheDocument() // Result Display
        expect(result).toHaveClass('text-red')
      })
      test('ShortBetChoice is H', () => {
        render(<TextHomeFav st_fav={-1} game_type={0} bet_choice="1H" home_name={name} />)
        const result = screen.getByText('Conor McGregor')
        expect(result).toBeInTheDocument() // Result Display
        expect(result).toHaveClass('text-red text-bold')
      })
      test('ShortBetChoice is empty and STFav is not -1', () => {
        render(<TextHomeFav st_fav={0} game_type={0} bet_choice="" home_name={name} />)
        const result = screen.getByText('Conor McGregor')
        expect(result).toBeInTheDocument() // Result Display
      })
    })
    test('GameType is OU AND ShortBetChoice is O', () => {
      render(<TextHomeFav st_fav={-1} game_type={5} bet_choice="1O" home_name={name} />)
      const result = screen.getByText('Conor McGregor')
      expect(result).toBeInTheDocument() // Result Display
      expect(result).toHaveClass('text-blue text-bold')
    })
    test('GameType is OE AND ShortBetChoice is O', () => {
      render(<TextHomeFav st_fav={-1} game_type={3} bet_choice="1O" home_name={name} />)
      const result = screen.getByText('Conor McGregor')
      expect(result).toBeInTheDocument() // Result Display
      expect(result).toHaveClass('text-green text-bold')
    })
    test('GameType is ML AND ShortBetChoice is H', () => {
      render(<TextHomeFav st_fav={-1} game_type={12} bet_choice="1H" home_name={name} />)
      const result = screen.getByText('Conor McGregor')
      expect(result).toBeInTheDocument() // Result Display
      expect(result).toHaveClass('font-weight-bold')
    })
    test('suffixText is Y', () => {
      render(<TextHomeFav st_fav={-1} game_type={0} bet_choice="" home_name={name} neutral_ground="Y" />) // prettier-ignore
      const result = screen.getByText('Conor McGregor (N)')
      expect(result).toBeInTheDocument() // Result Display
      expect(result).toHaveClass('text-red')
    })
    test('suffixText is N', () => {
      render(<TextHomeFav st_fav={-1} game_type={0} bet_choice="" home_name={name} neutral_ground="N" />) // prettier-ignore
      const result = screen.getByText('Conor McGregor')
      expect(result).toBeInTheDocument() // Result Display
      expect(result).toHaveClass('text-red')
    })
    test('GameType is not found', () => {
      render(<TextHomeFav st_fav={-1} game_type={28} bet_choice="1O" home_name={name} />)
      const result = screen.getByText('Conor McGregor')
      expect(result).toBeInTheDocument() // Result Display
    })
  })
  describe('TextAwayFav', () => {
    const name = 'Nate Diaz'
    describe('GameType is AH OR GAH', () => {
      test('STFav is 1', () => {
        render(<TextAwayFav st_fav={1} game_type={0} bet_choice="" away_name={name} />)
        const result = screen.getByText('Nate Diaz')
        expect(result).toBeInTheDocument() // Result Display
        expect(result).toHaveClass('text-red')
      })
      test('ShortBetChoice is A', () => {
        render(<TextAwayFav st_fav={1} game_type={0} bet_choice="1A" away_name={name} />)
        const result = screen.getByText('Nate Diaz')
        expect(result).toBeInTheDocument() // Result Display
        expect(result).toHaveClass('text-red font-weight-bold')
      })
      test('ShortBetChoice is empty and STFav is not 1', () => {
        render(<TextAwayFav st_fav={0} game_type={0} bet_choice="" away_name={name} />)
        const result = screen.getByText('Nate Diaz')
        expect(result).toBeInTheDocument() // Result Display
      })
    })
    test('GameType is OU AND ShortBetChoice is U', () => {
      render(<TextAwayFav st_fav={1} game_type={5} bet_choice="1U" away_name={name} />)
      const result = screen.getByText('Nate Diaz')
      expect(result).toBeInTheDocument() // Result Display
      expect(result).toHaveClass('text-blue font-weight-bold')
    })
    test('GameType is OE AND ShortBetChoice is E', () => {
      render(<TextAwayFav st_fav={1} game_type={3} bet_choice="OE2" away_name={name} />)
      const result = screen.getByText('Nate Diaz')
      expect(result).toBeInTheDocument() // Result Display
      expect(result).toHaveClass('text-green font-weight-bold')
    })
    test('GameType is ML AND ShortBetChoice is A', () => {
      render(<TextAwayFav st_fav={1} game_type={12} bet_choice="1A" away_name={name} />)
      const result = screen.getByText('Nate Diaz')
      expect(result).toBeInTheDocument() // Result Display
      expect(result).toHaveClass('font-weight-bold')
    })
    test('GameType is OE AND ShortBetChoice is Empty', () => {
      render(<TextAwayFav st_fav={1} game_type={3} bet_choice="" away_name={name} />)
      const result = screen.getByText('Nate Diaz')
      expect(result).toBeInTheDocument() // Result Display
    })
  })
})
