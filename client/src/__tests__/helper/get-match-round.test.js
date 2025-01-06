import getMatchRound from 'helper/get-match-round'
import { render, screen } from '__tests__/test-utils'

describe('getMatchRound', () => {
  test('match_round is 0', () => expect(getMatchRound(0)).toBe('Not Started'))
  test('match_round is 1', () => {
    render(getMatchRound(1))
    expect(screen.getByText('1 Half')).toBeInTheDocument()
    expect(screen.getByText('st')).toBeInTheDocument()
  })
  test('match_round is 2', () => expect(getMatchRound(2)).toBe('Half Time Break'))
  test('match_round is 3', () => {
    render(getMatchRound(3))
    expect(screen.getByText('2 Half')).toBeInTheDocument()
    expect(screen.getByText('nd')).toBeInTheDocument()
  })
  test('match_round is 4', () => expect(getMatchRound(4)).toBe('Extra Time Break'))
  test('match_round is 5', () => expect(getMatchRound(5)).toBe('Extra 1'))
  test('match_round is 6', () => expect(getMatchRound(6)).toBe('Extra 2'))
  test('match_round is not found', () => expect(getMatchRound(7)).toBeNull())
})
