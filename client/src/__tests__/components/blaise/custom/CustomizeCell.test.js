import React from 'react'
import { CustomizeCell, CustomizeHeader, CustomizeTable } from 'components/blaise'
import { fireEvent, render, screen } from '__tests__/test-utils'

describe('CustomizeCell', () => {
  const mockOnMouseEnter = jest.fn()
  const mockOnMouseLeave = jest.fn()
  test('Render', () => {
    const props = {
      className: 'text-red',
      onMouseEnter: mockOnMouseEnter,
      onMouseLeave: mockOnMouseLeave,
    }
    render(
      <table>
        <tbody>
          <tr>
            <CustomizeCell {...props}>Conor McGregor</CustomizeCell>
          </tr>
        </tbody>
      </table>,
    )
    const resultText = screen.getByText('Conor McGregor')
    const cellElement = screen.getByText('Conor McGregor')
    fireEvent.mouseEnter(cellElement)
    fireEvent.mouseLeave(cellElement)
    expect(resultText).toBeInTheDocument()
    expect(mockOnMouseEnter).toHaveBeenCalledTimes(0)
    expect(mockOnMouseLeave).toHaveBeenCalledTimes(0)
  })
})

describe('CustomizeHeader', () => {
  const mockOnMouseEnter = jest.fn()
  const mockOnMouseLeave = jest.fn()
  test('Render', () => {
    const props = {
      className: 'text-red',
      onMouseEnter: mockOnMouseEnter,
      onMouseLeave: mockOnMouseLeave,
    }
    render(
      <table>
        <thead>
          <tr>
            <CustomizeHeader {...props}>Conor McGregor</CustomizeHeader>
          </tr>
        </thead>
      </table>,
    )
    const resultText = screen.getByText('Conor McGregor')
    const cellElement = screen.getByText('Conor McGregor')
    fireEvent.mouseEnter(cellElement)
    fireEvent.mouseLeave(cellElement)
    expect(resultText).toBeInTheDocument()
    expect(mockOnMouseEnter).toHaveBeenCalledTimes(1)
    expect(mockOnMouseLeave).toHaveBeenCalledTimes(1)
  })
})

describe('CustomizeTable', () => {
  const mockOnMouseEnter = jest.fn()
  const mockOnMouseLeave = jest.fn()
  test('Render', () => {
    const props = {
      className: 'text-red',
      onMouseEnter: mockOnMouseEnter,
      onMouseLeave: mockOnMouseLeave,
    }
    render(
      <CustomizeTable {...props}>
        <tbody>
          <tr>
            <CustomizeCell>Conor McGregor</CustomizeCell>
          </tr>
        </tbody>
      </CustomizeTable>,
    )
    const resultText = screen.getByText('Conor McGregor')
    const cellElement = screen.getByText('Conor McGregor')
    fireEvent.mouseEnter(cellElement)
    fireEvent.mouseLeave(cellElement)
    expect(resultText).toBeInTheDocument()
    expect(mockOnMouseEnter).toHaveBeenCalledTimes(1)
    expect(mockOnMouseLeave).toHaveBeenCalledTimes(1)
  })
})
