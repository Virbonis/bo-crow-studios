import React from 'react'
import { InputDecimal } from 'components/blaise'
import { render, screen, fireEvent } from '__tests__/test-utils'

describe('InputDecimal', () => {
  describe('oldValue is not undefined AND value is not undefined AND classname is not empty', () => {
    test('oldValue is not equal to currentValue', () => {
      const { container } = render(<InputDecimal value={1} oldValue={0} />)
      expect(container.firstChild).toHaveClass('bg-orange')
    })
    test('oldValue is equal to currentValue', () => {
      const { container } = render(<InputDecimal value={1} oldValue={1} />)
      expect(container.firstChild).not.toHaveClass('bg-orange')
    })
  })
  test('Value is empty', () => {
    const { container } = render(<InputDecimal />)
    expect(container.firstChild).not.toHaveClass('bg-orange')
  })
  test('Value has 3 digits decimal', () => {
    render(<InputDecimal />)
    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: 12.345 } })
    expect(input.value).toBe('12.35')
  })
})
