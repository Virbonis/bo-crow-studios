import React from 'react'
import { CheckboxList } from 'components/blaise'
import { render } from '__tests__/test-utils'

describe('CheckboxList', () => {
  test('Render', () => {
    const props = {
      options: [
        { value: 'hidden_time', label: 'Hidden Time' },
        { value: 'open', label: 'Open' },
        { value: 'neutral_ground', label: 'Neutral Ground' },
      ],
      columns: 1,
    }
    const { container } = render(<CheckboxList {...props} />)
    expect(container).toBeInTheDocument()
  })
  test('Render with No Props', () => {
    const { container } = render(<CheckboxList />)
    expect(container).toBeInTheDocument()
  })
})
