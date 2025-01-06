import { convertDataEventLimit } from 'helper'

describe('convert-data-event-limit', () => {
  test('Render Data', () => {
    const record = [{ game_type_sequence: 10, game_type: [0, 2, 3, 5] }]
    expect(convertDataEventLimit(record)).toEqual([
      {
        game_type: [0, 2, 3, 5],
        game_type_sequence: 10,
        key: '0,2,3,510EM',
        market_group: 'EM',
        max_bet: undefined,
        max_limit: undefined,
        odds_trigger: undefined,
        spread: undefined,
        step: undefined,
      },
      {
        game_type: [0, 2, 3, 5],
        game_type_sequence: 10,
        key: '0,2,3,510TM',
        market_group: 'TM',
        max_bet: undefined,
        max_limit: undefined,
        odds_trigger: undefined,
        spread: undefined,
        step: undefined,
      },
      {
        game_type: [0, 2, 3, 5],
        game_type_sequence: 10,
        key: '0,2,3,510RB',
        market_group: 'RB',
        max_bet: undefined,
        max_limit: undefined,
        odds_trigger: undefined,
        spread: undefined,
        step: undefined,
      },
      {
        game_type: [0, 2, 3, 5],
        game_type_sequence: 10,
        key: '0,2,3,510TM6',
        market_group: 'TM6',
        max_bet: undefined,
        max_limit: undefined,
        odds_trigger: undefined,
        spread: undefined,
        step: undefined,
      },
    ])
  })
})
