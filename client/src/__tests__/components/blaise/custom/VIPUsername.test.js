import React from 'react'
import { VIPUsername } from 'components/blaise'
import { getVIPColorClass } from 'helper'
import { render, screen } from '__tests__/test-utils'

describe('VIPUsername', () => {
  test('GetVIPColorClass', () => {
    expect(getVIPColorClass('27')).toBe('vip_27')
  })
  describe('Render', () => {
    test('SignUpWeek is 0', () => {
      render(<VIPUsername username="Conor McGregor" vip_code="27" sign_up_week={0} />)
      const result = screen.getByText('+ Conor McGregor')
      expect(result).toBeInTheDocument()
      expect(result).toHaveClass('vip_27')
    })
    test('SignUpWeek is not 0', () => {
      render(<VIPUsername username="Conor McGregor" vip_code="27" sign_up_week={1} />)
      const result = screen.getByText('Conor McGregor')
      expect(result).toBeInTheDocument()
      expect(result).toHaveClass('vip_27')
    })
  })
})
