import {
  getEarlySettlement,
  getParlayComboTicket,
  getPlatform,
  getPresetsMinMaxDate,
  getResultDoubleQuarterWinner,
  getScoreFGLGText,
  getScoreGameTypeFGLG,
  getScoreGameTypeSpecial,
  getTraderDBRBPick,
  getVIPColorClass,
  getWinlossStatus,
  getWinlossStatusExport,
  getWinlossStatusName,
  getWinlossStatusNameExport,
} from 'helper'
import { render, screen } from '__tests__/test-utils'
import '../../index-extension'
import dayjs from 'dayjs'

describe('general', () => {
  describe('getVIPColorClass', () => {
    test('vip_code includes 27', () => expect(getVIPColorClass('1^27^23^21^29')).toBe('vip_27'))
    test('vip_code includes 28', () => expect(getVIPColorClass('1^28^23^21^29')).toBe('vip_28'))
    test('vip_code includes 23', () => expect(getVIPColorClass('1^23^20^21^29')).toBe('vip_23'))
    test('vip_code includes 29', () => expect(getVIPColorClass('1^14^20^21^29')).toBe('vip_29'))
    test('vip_code includes 18', () => expect(getVIPColorClass('1^14^20^21^18')).toBe('vip_18'))
    test('vip_code includes 15', () => expect(getVIPColorClass('1^14^20^21^15')).toBe('vip_15'))
    test('vip_code includes 8', () => expect(getVIPColorClass('1^14^20^21^8')).toBe('vip_8'))
    test('vip_code includes 11', () => expect(getVIPColorClass('1^14^20^21^11')).toBe('vip_11'))
    test('vip_code includes 9', () => expect(getVIPColorClass('1^14^20^21^9')).toBe('vip_9'))
    test('vip_code includes 17', () => expect(getVIPColorClass('1^14^20^21^17')).toBe('vip_17'))
    test('vip_code includes 14', () => expect(getVIPColorClass('1^14^20^21^14')).toBe('vip_14'))
    test('vip_code includes 12', () => expect(getVIPColorClass('1^5^20^21^12')).toBe('vip_12'))
    test('vip_code includes 1', () => expect(getVIPColorClass('1^19^20^21^3')).toBe('vip_1'))
    test('vip_code includes 3', () => expect(getVIPColorClass('3^19^20^21^1')).toBe('vip_3'))
    test('vip_code includes 16', () => expect(getVIPColorClass('5^16^20^21^26')).toBe('vip_16'))
    test('vip_code includes 5', () => expect(getVIPColorClass('5^25^20^21^26')).toBe('vip_5'))
    test('vip_code includes 6', () => expect(getVIPColorClass('6^25^20^21^24')).toBe('vip_6'))
    test('vip_code includes 7 AND 26', () =>
      expect(getVIPColorClass('7^25^20^21^26')).toBe('vip_7_26'))
    test('vip_code includes 7', () => expect(getVIPColorClass('7^25^20^21^24')).toBe('vip_7'))
    test('vip_code includes 21', () => expect(getVIPColorClass('25^20^21^24')).toBe('vip_21'))
    test('vip_code includes 23 AND 24', () =>
      expect(getVIPColorClass('23^25^20^24')).toBe('vip_23_24'))
    test('vip_code includes 24', () => expect(getVIPColorClass('25^20^24')).toBe('vip_24'))
    test('vip_code includes 25', () => expect(getVIPColorClass('25^26')).toBe('vip_25'))
    test('vip_code includes 26', () => expect(getVIPColorClass('26')).toBe('vip_26'))
    test('vip_code is not found', () => expect(getVIPColorClass('')).toBe(''))
  })
  describe('getPlatform', () => {
    test('txn_type is NULL', () => expect(getPlatform('')).toEqual(''))
    test('txn_type is not NULL', () => expect(getPlatform('BUY')).toBe('Buyback'))
    test('txn_type is not found', () => expect(getPlatform('LOL')).toBe('LOL'))
  })
  describe('getTraderDBRBPick', () => {
    test('trader is NULL', () => expect(getTraderDBRBPick('')).toEqual([[], [], []]))
    test('trader is not NULL', () =>
      expect(
        getTraderDBRBPick(
          'RBHT~alexa_trader;RBFT~alexa_trader;PICKDBHT~FERRY2;PICKDBFT~FERRY2;IDRBHT~3491^24^0;IDRBFT~3491^24^0;IDPICKDBHT~3517^0^0;IDPICKDBFT~3517^0^0;',
        ),
      ).toEqual([
        ['RBHT~alexa_trader', 'RBFT~alexa_trader'],
        [],
        ['PICKDBHT~FERRY2', 'PICKDBFT~FERRY2'],
      ]))
  })
  describe('getParlayComboTicket', () => {
    test('folds is 2', () => expect(getParlayComboTicket(2)).toBe('Doubles'))
    test('folds is 3', () => expect(getParlayComboTicket(3)).toBe('Trebles'))
    test('folds is not 2 AND 3', () => expect(getParlayComboTicket(4)).toBe('4-folds'))
  })
  describe('getWinlossStatus', () => {
    test('void_id is not 0 AND NULL', () => {
      const record = {
        void_id: 2,
        void_desc: 'LOL',
        void_user: 'Dana White',
        winloss_status: 'W',
        jwl: 0.5,
      }
      render(getWinlossStatus(record))
      const void_desc = screen.getByText('LOL')
      const void_user = screen.getByText('by Dana White')
      expect(void_desc).toBeInTheDocument()
      expect(void_user).toBeInTheDocument()
    })
    test('void_id is 0 AND NULL', () => {
      const record = {
        void_id: 0,
        void_desc: 'LOL',
        void_user: 'Dana White',
        winloss_status: 'W',
        jwl: 0.5,
      }
      render(getWinlossStatus(record))
      const result = screen.getByText('Win Half')
      expect(result).toBeInTheDocument()
    })
    test('game_type is -1', () => {
      const record = {
        void_id: '',
        game_type: -1,
        winloss_status: 'W',
        jwl: 0.5,
      }
      render(getWinlossStatus(record))
      const result = screen.getByText('Win')
      expect(result).toBeInTheDocument()
      expect(result).toHaveClass('text-green')
    })
  })
  describe('getWinlossStatusName', () => {
    describe('Status is W', () => {
      test('jwl is 0.5', () => {
        render(getWinlossStatusName('W', 0.5))
        const result = screen.getByText('Win Half')
        expect(result).toBeInTheDocument()
        expect(result).toHaveClass('text-green')
      })
      test('jwl is not 0.5', () => {
        render(getWinlossStatusName('W', 1))
        const result = screen.getByText('Win')
        expect(result).toBeInTheDocument()
        expect(result).toHaveClass('text-green')
      })
    })
    describe('Status is L', () => {
      test('jwl is 0.5', () => {
        render(getWinlossStatusName('L', 0.5))
        const result = screen.getByText('Loss Half')
        expect(result).toBeInTheDocument()
        expect(result).toHaveClass('text-red')
      })
      test('jwl is not 0.5', () => {
        render(getWinlossStatusName('L', 1))
        const result = screen.getByText('Loss')
        expect(result).toBeInTheDocument()
        expect(result).toHaveClass('text-red')
      })
    })
    test('Status is D', () => {
      render(getWinlossStatusName('D', 0))
      const result = screen.getByText('Draw')
      expect(result).toBeInTheDocument()
      expect(result).toHaveClass('text-blue')
    })
    test('Status is C', () => {
      render(getWinlossStatusName('C', 0))
      const result = screen.getByText('Cancel')
      expect(result).toBeInTheDocument()
    })
    test('Status is P', () => {
      render(getWinlossStatusName('P', 0))
      const result = screen.getByText('Postponed')
      expect(result).toBeInTheDocument()
    })
    test('Status is not found', () => {
      const result = getWinlossStatusName('S', 0)
      expect(result).toBeNull()
    })
  })
  describe('getWinlossStatusExport', () => {
    test('void_id is not 0 and not NULL', () => {
      const record = {
        void_id: 2,
        void_desc: 'LOL',
        void_user: 'Dana White',
        winloss_status: 'W',
        jwl: 0.5,
      }
      expect(getWinlossStatusExport(record)).toBe('LOL by Dana White')
    })
    test('void_id is 0 and NULL', () => {
      const record = {
        void_id: 0,
        void_desc: 'LOL',
        void_user: 'Dana White',
        winloss_status: 'W',
        jwl: 0.5,
      }
      expect(getWinlossStatusExport(record)).toBe('Win Half')
    })
  })
  describe('getWinlossStatusNameExport', () => {
    describe('Status is W', () => {
      test('jwl is 0.5', () => expect(getWinlossStatusNameExport('W', 0.5)).toBe('Win Half'))
      test('jwl is not 0.5', () => expect(getWinlossStatusNameExport('W', 1)).toBe('Win'))
    })
    describe('Status is L', () => {
      test('jwl is 0.5', () => expect(getWinlossStatusNameExport('L', 0.5)).toBe('Loss Half'))
      test('jwl is not 0.5', () => expect(getWinlossStatusNameExport('L', 1)).toBe('Loss'))
    })
    test('Status is D', () => expect(getWinlossStatusNameExport('D', 0.5)).toBe('Draw'))
    test('Status is C', () => expect(getWinlossStatusNameExport('C', 0.5)).toBe('Cancel'))
    test('Status is P', () => expect(getWinlossStatusNameExport('P', 0.5)).toBe('Postponed'))
    test('Status is not found', () => expect(getWinlossStatusNameExport('E', 0.5)).toBeNull())
  })
  describe('getScoreGameTypeFGLG', () => {
    test('fg_team is 0 AND lg_team is 0', () => expect(getScoreGameTypeFGLG(0, 0)).toBe('No Score'))
    test('fg_team is not 0 AND lg_team is not 0', () =>
      expect(getScoreGameTypeFGLG(-1, 1)).toBe('Home - Away'))
  })
  describe('getScoreFGLGText', () => {
    test('Score is 0', () => expect(getScoreFGLGText(0)).toBe('No Goal'))
    test('Score is -1', () => expect(getScoreFGLGText(-1)).toBe('Home'))
    test('Score is 1', () => expect(getScoreFGLGText(1)).toBe('Away'))
    test('Score is 2', () => {
      render(getScoreFGLGText(2))
      const result = screen.getByText('Cancelled')
      expect(result).toBeInTheDocument()
    })
    test('Score is not found', () => expect(getScoreFGLGText(3)).toBe(3))
  })
  describe('getScoreGameTypeSpecial', () => {
    describe('GameType is 20', () => {
      const game_type = 20
      test('fs_home is 1', () => expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 0)).toBe('Yes'))
      test('fs_home is -1', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, -1, 0)).toBe('No'))
      test('fs_home is 0', () => expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 0)).toBe(''))
    })
    describe('GameType is 41', () => {
      const game_type = 41
      test('fs score is greater than ht', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 1)).toBe('Yes'))
      test('fs score is less than ht', () =>
        expect(getScoreGameTypeSpecial(game_type, 1, 0, 1, 1)).toBe('No'))
    })
    describe('GameType is [37, 38, 28, 34, 39, 59, 60] OR (game_type >= 1101 && game_type <= 1115)', () => {
      const game_type = 37
      test('fs score is greater than ht', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 1)).toBe('FS: 1 - 1'))
      test('game_type is not found', () =>
        expect(getScoreGameTypeSpecial(1102, 0, 0, 1, 1)).toBe('FS: 1 - 1'))
    })
    describe('GameType is 42', () => {
      const game_type = 42
      test('ht_home is greater than ht_away OR fs_home is greater than fs_away', () =>
        expect(getScoreGameTypeSpecial(game_type, 1, 0, 0, 1)).toBe('Yes'))
      test('ht_home is less than ht_away OR fs_home is less than fs_away', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 1)).toBe('No'))
    })
    describe('GameType is 43', () => {
      const game_type = 43
      test('ht_away is greater than ht_home OR fs_away is greater than fs_home', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 1, 0, 1)).toBe('Yes'))
      test('ht_away is less than ht_home OR fs_away is less than fs_home', () =>
        expect(getScoreGameTypeSpecial(game_type, 1, 0, 1, 0)).toBe('No'))
    })
    describe('GameType is 44', () => {
      const game_type = 44
      test('ht_home is greater than ht_away AND result score_home > score_away', () =>
        expect(getScoreGameTypeSpecial(game_type, 1, 0, 2, 0)).toBe('Yes'))
      test('ht_home is less than ht_away AND result score_home < score_away', () =>
        expect(getScoreGameTypeSpecial(game_type, 1, 0, 0, 1)).toBe('No'))
    })
    describe('GameType is 45', () => {
      const game_type = 45
      test('ht_away is greater than ht_home AND result score_away > score_home', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 1, 0, 2)).toBe('Yes'))
      test('ht_away is less than ht_home AND result score_away < score_home', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 2)).toBe('No'))
    })
    describe('GameType is 26', () => {
      const game_type = 26
      test('fs_home is 0 AND fs_away is 0', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 0)).toBe('None'))
      test('fs_home is 1 AND fs_away is 0', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 0)).toBe('Home'))
      test('fs_home is 0 AND fs_away is 1', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 1)).toBe('Away'))
      test('fs_home is 1 AND fs_away is 1', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 1)).toBe('Both'))
      test('fs_home is 2 AND fs_away is 2', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 2, 2)).toBe(''))
    })
    describe('GameType is 46', () => {
      const game_type = 46
      test('ht_home is greater than 0 AND fs_home is greater than ht_home', () =>
        expect(getScoreGameTypeSpecial(game_type, 1, 0, 2, 0)).toBe('Yes'))
      test('ht_home is less than 0 AND fs_home is less than ht_home', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 2, 0)).toBe('No'))
    })
    describe('GameType is 47', () => {
      const game_type = 47
      test('ht_away is greater than 0 AND fs_away is greater than ht_away', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 1, 0, 2)).toBe('Yes'))
      test('ht_away is less than 0 AND fs_away is less than ht_away', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 2)).toBe('No'))
    })
    describe('GameType is 30', () => {
      const game_type = 30
      test('Result is less than scoreHT', () =>
        expect(getScoreGameTypeSpecial(game_type, 1, 1, 0, 0)).toBe('1st Half'))
      test('Result is greater than scoreHT', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 1)).toBe('2nd Half'))
      test('Result has the same value comparasion', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 0)).toBe('Draw'))
    })
    describe('GameType is 48', () => {
      const game_type = 48
      test('ht_home is greater than Result', () =>
        expect(getScoreGameTypeSpecial(game_type, 1, 1, 1, 0)).toBe('1st Half'))
      test('ht_home is less than Result', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 1, 1, 0)).toBe('2nd Half'))
      test('Result has the same value comparasion', () =>
        expect(getScoreGameTypeSpecial(game_type, 1, 1, 2, 0)).toBe('Draw'))
    })
    describe('GameType is 49', () => {
      const game_type = 49
      test('ht_away is greater than Result', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 1, 0, 1)).toBe('1st Half'))
      test('ht_away is less than Result', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 2)).toBe('2nd Half'))
      test('Result has the same value comparasion', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 1, 1, 2)).toBe('Draw'))
    })
    describe('GameType is 29', () => {
      const game_type = 29
      test('ht_away is greater than Result', () =>
        expect(getScoreGameTypeSpecial(game_type, 1, 1, 1, 1)).toBe(`HT: 1 - 1 
    FS: 1 - 1`))
    })
    describe('GameType is 23', () => {
      const game_type = 23
      test('fs_home is -1', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, -1, 0)).toBe('None'))
      test('fs_home is 1', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 0)).toBe('Home'))
      test('fs_home is 2', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 2, 0)).toBe('Away'))
      test('fs_home is 3', () => expect(getScoreGameTypeSpecial(game_type, 0, 0, 3, 0)).toBe(''))
    })
    describe('GameType is 22', () => {
      const game_type = 22
      test('fs_home is 1', () => expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 0)).toBe('Yes'))
      test('fs_home is -1', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, -1, 0)).toBe('No'))
      test('fs_home is 0', () => expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 0)).toBe(''))
    })
    describe('GameType is 40', () => {
      const game_type = 40
      test('fs_home is 0 AND fs_away is 0', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 0)).toBe('Home Yes, Away Yes'))
      test('fs_home is 1 AND fs_away is 0', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 0)).toBe('Home Yes, Away No'))
      test('fs_home is 0 AND fs_away is 1', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 1)).toBe('Home No, Away Yes'))
      test('fs_home is not 0 AND fs_away is not 0', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 1)).toBe('Home No, Away No'))
    })
    describe('GameType is 21', () => {
      const game_type = 21
      test('fs_home is 1', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 0)).toBe('Free Kick'))
      test('fs_home is 2', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 2, 0)).toBe('Header'))
      test('fs_home is 3', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 3, 0)).toBe('No Goal'))
      test('fs_home is 4', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 4, 0)).toBe('Own Goal'))
      test('fs_home is 5', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 5, 0)).toBe('Penalty'))
      test('fs_home is 6', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 6, 0)).toBe('Shot'))
      test('fs_home is 0', () => expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 0)).toBe(''))
    })
    describe('GameType is 27', () => {
      const game_type = 27
      test('fs_home is 1', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 0)).toBe('1 minute'))
      test('fs_home is 2', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 2, 0)).toBe('2 minutes'))
      test('fs_home is 3', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 3, 0)).toBe('3 minutes'))
      test('fs_home is 4', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 4, 0)).toBe('4 minutes'))
      test('fs_home is 5', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 5, 0)).toBe('5 minutes or More'))
      test('fs_home is 6', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 6, 0)).toBe('None'))
      test('fs_home is 0', () => expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 0)).toBe(''))
    })
    describe('GameType is 25', () => {
      const game_type = 25
      test('fs_home is 1', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 0)).toBe('27th Minute Onwards'))
      test('fs_home is 2', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 2, 0)).toBe(
          'Up To And Including The 26th Minute',
        ))
      test('fs_home is 3', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 3, 0)).toBe('No Goal'))
      test('fs_home is 0', () => expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 0)).toBe(''))
    })
    describe('GameType is 35', () => {
      const game_type = 35
      test('fs_home is 1', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 1, 0)).toBe('Any Goal Score Draw'))
      test('fs_home is 2', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 2, 0)).toBe('Home Team To Win By 1 Goal'))
      test('fs_home is 3', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 3, 0)).toBe('Home Team To Win By 2 Goal'))
      test('fs_home is 4', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 4, 0)).toBe('Home Team To Win By 3 Goal'))
      test('fs_home is 5', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 5, 0)).toBe(
          'Home Team To Win By 4 Or More Goal',
        ))
      test('fs_home is 6', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 6, 0)).toBe('Away Team To Win By 1 Goal'))
      test('fs_home is 7', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 7, 0)).toBe('Away Team To Win By 2 Goal'))
      test('fs_home is 8', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 8, 0)).toBe('Away Team To Win By 3 Goal'))
      test('fs_home is 9', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 9, 0)).toBe(
          'Away Team To Win By 4 Or More Goal',
        ))
      test('fs_home is 10', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 10, 0)).toBe('No Goal'))
      test('fs_home is not found', () =>
        expect(getScoreGameTypeSpecial(game_type, 0, 0, 0, 0)).toBe(''))
    })
    test('GameType is in ListGTScoringInput', () =>
      expect(getScoreGameTypeSpecial(1210, 0, 0, 1, 0)).toBe('FS: 1-0'))
    test('GameType is 1280', () =>
      expect(getScoreGameTypeSpecial(1280, 0, 0, 123, 0)).toEqual(
        'Q1 Home Win\nQ2 Away Win\nQ3 AOS\n',
      ))
    test('GameType is in ListGTScoringDropdown', () =>
      expect(getScoreGameTypeSpecial(1208, 0, 0, 1, 0)).toBe('Home Team'))
    test('GameType is in ListGTScoringDropdown', () =>
      expect(getScoreGameTypeSpecial(1236, 0, 0, 3, 0)).toBe('3'))
    test('GameType is not found', () => expect(getScoreGameTypeSpecial(200, 0, 0, 0, 0)).toBe(''))
  })
  describe('getResultDoubleQuarterWinner', () => {
    test('FSHome is 1', () => expect(getResultDoubleQuarterWinner(1)).toBe('Home Win'))
    test('FSHome is 2', () => expect(getResultDoubleQuarterWinner(2)).toBe('Away Win'))
    test('FSHome is 3', () => expect(getResultDoubleQuarterWinner(3)).toBe('AOS'))
    test('FSHome is 0', () => expect(getResultDoubleQuarterWinner(0)).toBe('Unscored'))
  })
  describe('getEarlySettlement', () => {
    test('early_statement_id is not empty', () =>
      expect(getEarlySettlement('6331308^1^1^6')).toBe('E(1-1)'))
    test('early_statement_id is empty', () => expect(getEarlySettlement('')).toBe(''))
  })
  describe('getPresetsMinMaxDate', () => {
    test('MaxDate and MinDate are defined', () => {
      const minDate = dayjs('2020-01-01')
      const maxDate = dayjs('2020-12-01')

      // Expected result after adjusting presets
      const expectedPresets = [
        { label: 'Today', value: ['2024-03-22T00:00:00.000Z', '2020-11-30T17:00:00.000Z'] },
        { label: 'This Week', value: ["2024-03-17T00:00:00Z", "2020-11-30T17:00:00.000Z"] }, // prettier-ignore
        { label: 'This Month', value: ["2024-03-01T00:00:00Z", "2020-11-30T17:00:00.000Z"] }, // prettier-ignore
        { label: 'This Year', value: ["2024-01-01T00:00:00Z", "2020-11-30T17:00:00.000Z"] }, // prettier-ignore
      ]

      // Call the function with mock data
      const adjustedPresets = getPresetsMinMaxDate(minDate, maxDate)

      // Convert all date values to ISO string representations for comparison
      const adjustedPresetsISO = adjustedPresets.map(item => ({
        label: item.label,
        value: item.value.map(date => dayjs(date).toISOString()),
      }))
      const expectedPresetsISO = expectedPresets.map(item => ({
        label: item.label,
        value: item.value.map(date => dayjs(date).toISOString()),
      }))

      // Compare the result with the expected output
      expect(adjustedPresetsISO).toEqual(expectedPresetsISO)
    })
    test('Only MinDate is defined', () => {
      const minDate = dayjs('2025-03-01')

      // Expected result after adjusting presets
      const expectedPresets = [
        { label: 'Today', value: ['2025-02-28T17:00:00.00Z', '2024-03-22T23:59:59.999Z'] },
        { label: 'This Week', value: ["2025-02-28T17:00:00.00Z", "2024-03-23T23:59:59.999Z"] }, // prettier-ignore
        { label: 'This Month', value: ["2025-02-28T17:00:00.00Z", "2024-03-31T23:59:59.999Z"] }, // prettier-ignore
        { label: 'This Year', value: ["2025-02-28T17:00:00.00Z", "2024-12-31T23:59:59.999Z"] }, // prettier-ignore
      ]

      // Call the function with mock data
      const adjustedPresets = getPresetsMinMaxDate(minDate, null)

      // Convert all date values to ISO string representations for comparison
      const adjustedPresetsISO = adjustedPresets.map(item => ({
        label: item.label,
        value: item.value.map(date => dayjs(date).toISOString()),
      }))
      const expectedPresetsISO = expectedPresets.map(item => ({
        label: item.label,
        value: item.value.map(date => dayjs(date).toISOString()),
      }))

      // Compare the result with the expected output
      expect(adjustedPresetsISO).toEqual(expectedPresetsISO)
    })
    test('Only MaxDate is defined', () => {
      const maxDate = dayjs('2025-03-01')

      // Expected result after adjusting presets
      const expectedPresets = [
        { label: 'Today', value: ['2024-03-22T00:00:00.000Z', '2024-03-22T23:59:59.999Z'] },
        { label: 'This Week', value: ["2024-03-17T00:00:00.000Z", "2024-03-23T23:59:59.999Z"] }, // prettier-ignore
        { label: 'This Month', value: ["2024-03-01T00:00:00.000Z", "2024-03-31T23:59:59.999Z"] }, // prettier-ignore
        { label: 'This Year', value: ["2024-01-01T00:00:00.000Z", "2024-12-31T23:59:59.999Z"] }, // prettier-ignore
      ]

      // Call the function with mock data
      const adjustedPresets = getPresetsMinMaxDate(null, maxDate)

      // Convert all date values to ISO string representations for comparison
      const adjustedPresetsISO = adjustedPresets.map(item => ({
        label: item.label,
        value: item.value.map(date => dayjs(date).toISOString()),
      }))
      const expectedPresetsISO = expectedPresets.map(item => ({
        label: item.label,
        value: item.value.map(date => dayjs(date).toISOString()),
      }))

      // Compare the result with the expected output
      expect(adjustedPresetsISO).toEqual(expectedPresetsISO)
    })
  })
})
