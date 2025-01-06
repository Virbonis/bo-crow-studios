import React from 'react'
import { BetGameTypeColumn } from 'components/blaise'
import { getParlayComboTicket } from 'helper'
import { render, screen } from '__tests__/test-utils'

describe('BetGameTypeColumn', () => {
  test('GameTypeNameBTI', () => {
    render(<BetGameTypeColumn game_type_name_bti="BAMBANG" />)
    expect(screen.getByText('BAMBANG')).toBeInTheDocument()
  })
  test('GetParlayComboTicket', () => {
    expect(getParlayComboTicket(2)).toBe('Doubles')
    expect(getParlayComboTicket(3)).toBe('Trebles')
    expect(getParlayComboTicket(4)).toBe('4-folds')
    expect(getParlayComboTicket(5)).toBe('5-folds')
  })
  test('Bet Live Status', () => {
    render(<BetGameTypeColumn bet_live_status="Y" />)
    expect(screen.getByText('Live')).toBeInTheDocument()
  })
  test('Render GameType is Mix Parlay && Tickets more than 2', () => {
    render(<BetGameTypeColumn game_type={-1} bet_live_status="Y" tickets={2} folds={2} />)
    const gameType = screen.getByText('Mix Parlay')
    const displayBetLiveStatus = screen.getByText('Live')
    const displayFolds = screen.getByText('Doubles')
    const displayTickets = screen.getByText('(2 tickets)')
    expect(gameType).toBeInTheDocument()
    expect(displayBetLiveStatus).toBeInTheDocument()
    expect(displayFolds).toBeInTheDocument()
    expect(displayTickets).toBeInTheDocument()
  })
})
