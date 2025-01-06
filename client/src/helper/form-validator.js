import { isOddsValid } from 'helper'

export const getValidatorOdds = game_type => (_, value) => {
  const [isValid, errMsg] = isOddsValid(value, game_type)
  if (!isValid) return Promise.reject(new Error(errMsg))
  return Promise.resolve()
}

export const validatorSpecialChar = (_, value) => {
  const specialChar = /[~^|%!_']/

  if (specialChar.test(value))
    return Promise.reject(new Error(`Text is not allowed contains this symbol ~ ^ | % ! _ '`))
  return Promise.resolve()
}

export const validatorNumeric = (_, value) => {
  if (value) {
    if (value.toString().includes(' ')) {
      return Promise.reject(new Error('No spaces allowed'))
    }
    if (!/^\d+$/.test(value)) {
      return Promise.reject(new Error('Numeric'))
    }
  }
  return Promise.resolve()
}

export const validatorSingleQuote = (_, value) => {
  const singeQuote = /'/

  if (singeQuote.test(value))
    return Promise.reject(new Error('Text is not allowed contains single quote'))
  return Promise.resolve()
}

export const validatorTrim = (_, value) => {
  // const negateTrim = /^[^\s]+(?:\s[^\s]+)*$/
  const startEndWhitespace = /^\s+|\s+$/

  if (startEndWhitespace.test(value))
    return Promise.reject(new Error('The string must not start or end with whitespace'))
  return Promise.resolve()
}

export default getValidatorOdds
