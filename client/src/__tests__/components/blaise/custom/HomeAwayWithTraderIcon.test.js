import React from 'react'
import { HomeAwayWithTraderIcon } from 'components/blaise'
import { render, screen } from '__tests__/test-utils'

describe('HomeAwayWithTraderIcon', () => {
  describe('Render', () => {
    const record = {
      trader:
        'RBHT~alexa_trader;RBFT~alexa_trader;PICKDBHT~FERRY2;PICKDBFT~FERRY2;DBHT~bambang_trader:IDRBHT~3491^24^0;IDRBFT~3491^24^0;IDPICKDBHT~3517^0^0;IDPICKDBFT~3517^0^0;',
      home_name: 'Conor McGregor',
      away_name: 'Nate Diaz',
      provider_name: 'Indihome',
    }
    test('Home and Away name', () => {
      render(<HomeAwayWithTraderIcon {...record} />)
      const homeName = screen.getByText('Conor McGregor')
      const awayName = screen.getByText('Nate Diaz')
      expect(homeName).toBeInTheDocument()
      expect(awayName).toBeInTheDocument()
    })
    test('IconProvider, IconRB, IconDB, IconPick', () => {
      const { container } = render(<HomeAwayWithTraderIcon {...record} />)
      expect(container.querySelector('.icon_provider')).toBeInTheDocument()
      expect(container.querySelector('.icon_rb')).toBeInTheDocument()
      expect(container.querySelector('.icon_db')).toBeInTheDocument()
      expect(container.querySelector('.icon_pick')).toBeInTheDocument()
    })
  })
})
