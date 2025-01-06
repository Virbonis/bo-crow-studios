import TimerFormat from 'helper/timer-format'

describe('timer-format', () => {
  describe('EventRound AND Timer is not NULL', () => {
    test('second is more than 10', () => expect(TimerFormat(1, 70)).toBe('1:10'))
    test('second is less than 10', () => expect(TimerFormat(1, 68)).toBe('1:08'))
    test('second is less than 10', () => expect(TimerFormat(0, 0)).toBe(''))
  })
  test('Timer is NULL', () => expect(TimerFormat(1)).toBe(''))
})
