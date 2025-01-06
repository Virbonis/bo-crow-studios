const { GeneralFormProps } = require('components/blaise')

describe('GeneralFormProps', () => {
  test('should call refresh and update pagination when changedValues do not include any field from fields', () => {
    const fields = ['field1', 'field2']
    const refresh = jest.fn()
    const setPagination = jest.fn()
    const props = GeneralFormProps(fields, refresh, setPagination)

    props.onValuesChange({})

    expect(setPagination).toHaveBeenCalled()
    expect(refresh).toHaveBeenCalled()
  })

  test('should call refresh and update pagination when Enter key is pressed', () => {
    const refresh = jest.fn()
    const setPagination = jest
      .fn()
      .mockImplementation(pagination => ({ ...pagination, current_page: 1 }))
    const props = GeneralFormProps([], refresh, setPagination)

    props.onKeyPress({ key: 'Enter' })

    expect(setPagination).toHaveBeenCalled()
    expect(refresh).toHaveBeenCalled()
  })

  test('should not call refresh or update pagination when changedValues include a field from fields', () => {
    const fields = ['field1', 'field2']
    const refresh = jest.fn()
    const setPagination = jest.fn()
    const props = GeneralFormProps(fields, refresh, setPagination)

    props.onValuesChange({ field1: 'value' })

    expect(setPagination).not.toHaveBeenCalled()
    expect(refresh).not.toHaveBeenCalled()
  })

  test('should not call refresh or update pagination when Enter key is pressed with a key other than "Enter"', () => {
    const refresh = jest.fn()
    const setPagination = jest.fn()
    const props = GeneralFormProps([], refresh, setPagination)

    props.onKeyPress({ key: 'Escape' })

    expect(setPagination).not.toHaveBeenCalled()
    expect(refresh).not.toHaveBeenCalled()
  })
})
