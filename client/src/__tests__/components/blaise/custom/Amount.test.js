import React from 'react'
import { Amount, amount } from 'components/blaise'
import { render, screen } from '__tests__/test-utils'

describe('Amount', () => {
  describe('Amount Function', () => {
    test('No Parameter', () => expect(amount()).toBe(0))
    test('Value is not NaN', () => {
      expect(amount(2, 2)).toBe('2.00')
      expect(amount(3, 4)).toBe('3.0000')
      expect(amount(-3, 2)).toBe('-3.00')
    })
    test('Value is NaN', () => expect(amount('a', 'a')).toBe(0))
    test('Length is 0', () => expect(amount(0, 0)).toBe('0'))
  })
  describe('Render', () => {
    test('No Props', () => {
      render(<Amount />)
      const result = screen.getByText('0.00')
      expect(result).toBeInTheDocument()
    })
    test('Value is more than 0', () => {
      render(<Amount value={2} length={3} />)
      const result = screen.getByText('2.000')
      expect(result).toBeInTheDocument()
    })
    test('Value is less than 0', () => {
      render(<Amount value={-2} length={3} />)
      const result = screen.getByText('-2.000')
      expect(result).toBeInTheDocument()
      expect(result).toHaveClass('text-red')
    })
    test('Value is int', () => {
      render(<Amount value={2.35} length={3} int />)
      const result = screen.getByText('2')
      expect(result).toBeInTheDocument()
    })
    test('Result in Blue Color', () => {
      render(<Amount value={-2} length={3} mc />)
      const result = screen.getByText('-2.000')
      expect(result).toBeInTheDocument()
      expect(result).toHaveClass('text-blue')
    })
    test('Keep Result in Red Color', () => {
      render(<Amount value={2} length={3} keepRed />)
      const result = screen.getByText('2.000')
      expect(result).toBeInTheDocument()
      expect(result).toHaveClass('text-red')
    })
    test('Keep Result in No Color', () => {
      render(<Amount value={-2} length={3} noColor />)
      const result = screen.getByText('-2.000')
      expect(result).toBeInTheDocument()
      expect(result).toHaveClass('text-reset')
    })
    test('Result in Bold', () => {
      render(<Amount value={-2} length={3} bold />)
      const result = screen.getByText('-2.000')
      expect(result).toBeInTheDocument()
      expect(result).toHaveClass('font-weight-bold')
    })
    test('Keep The Result Minus', () => {
      render(<Amount value={-2} length={3} keepMinus={false} />)
      const result = screen.getByText('2.000')
      expect(result).toBeInTheDocument()
    })
    test('Result with Brackets', () => {
      render(<Amount value={-2} length={3} keepMinus={false} brackets />)
      const result = screen.getByText('(2.000)')
      expect(result).toBeInTheDocument()
    })
  })
})
