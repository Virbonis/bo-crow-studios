import {
  getValidatorOdds,
  validatorNumeric,
  validatorSingleQuote,
  validatorSpecialChar,
  validatorTrim,
} from 'helper'

describe('form-validator', () => {
  describe('getValidatorOdds', () => {
    // Promise Resolved
    test('Valid', async () => {
      const validator = getValidatorOdds(0)
      await expect(validator(null, 1)).resolves.toBeUndefined()
    })
    // Promise Error
    test('Not Valid', async () => {
      const validator = getValidatorOdds(0)
      await expect(validator(null, -2)).rejects.toThrow(Error)
    })
  })
  describe('validatorSpecialChar', () => {
    // Promise Resolved
    test('Valid', async () => {
      const validator = validatorSpecialChar(null, 'Bambang')
      await expect(validator).resolves.toBeUndefined()
    })
    // Promise Error
    test('Not Valid', async () => {
      const validator = validatorSpecialChar(null, 'Bambang!')
      await expect(validator).rejects.toThrowError(
        "Text is not allowed contains this symbol ~ ^ | % ! _ '",
      )
    })
    test('Empty input', async () => {
      await expect(validatorSpecialChar(null, '')).resolves.toBeUndefined()
    })

    test('Input is NULL', async () => {
      await expect(validatorSpecialChar(null, null)).resolves.toBeUndefined()
    })
  })
  describe('validatorNumeric', () => {
    test('Input Contains Spaces', async () => {
      const validator = validatorNumeric(null, 10)
      await expect(validator).resolves.toBeUndefined()
    })
    test('Input Contains Spaces', async () => {
      const validator = validatorNumeric(null, 'LALA 123')
      await expect(validator).rejects.toThrowError('No spaces allowed')
    })
    test('Input Contains Alphabets', async () => {
      const validator = validatorNumeric(null, 'Bambang123')
      await expect(validator).rejects.toThrowError('Numeric')
    })
    test('Input is NULL', async () => {
      const validator = validatorNumeric(null, null)
      await expect(validator).resolves.toBeUndefined()
    })
  })
  describe('validatorSingleQuote', () => {
    test('Valid Input', async () => {
      const validator = validatorSingleQuote(null, 'LALA 123')
      await expect(validator).resolves.toBeUndefined()
    })
    test('Input Contains Spaces', async () => {
      const validator = validatorSingleQuote(null, `AAAAA'`)
      await expect(validator).rejects.toThrowError('Text is not allowed contains single quote')
    })
  })
  describe('validatorTrim', () => {
    test('Valid Input', async () => {
      const validator = validatorTrim(null, ' ')
      await expect(validator).rejects.toThrowError(
        'The string must not start or end with whitespace',
      )
    })
    test('Input Contains Spaces', async () => {
      const validator = validatorTrim(null, `AAAAA'`)
      await expect(validator).resolves.toBeUndefined()
    })
  })
})
