// Overriding CreateReactApp settings, ref: https://github.com/arackaf/customize-cra
const {
  override,
  // fixBabelImports,
  addLessLoader,
  useEslintRc,
  addDecoratorsLegacy,
  useBabelRc,
} = require('customize-cra')

// eslint config
const eslintConfig = require('./.eslintrc.js')
const useEslintConfig = configRules => config => {
  const updatedRules = config.module.rules.map(rule => {
    // Only target rules that have defined a `useEslintrc` parameter in their options
    if (rule.use && rule.use.some(use => use.options && use.options.useEslintrc !== void 0)) {
      const ruleUse = rule.use[0]
      const baseOptions = ruleUse.options
      const baseConfig = baseOptions.baseConfig || {}
      const newOptions = {
        useEslintrc: false,
        ignore: true,
        baseConfig: { ...baseConfig, ...configRules },
      }
      ruleUse.options = newOptions
      return rule

      // Rule not using eslint. Do not modify.
    } else {
      return rule
    }
  })

  config.module.rules = updatedRules
  return config
}

module.exports = {
  webpack: override(
    addDecoratorsLegacy(),
    useEslintRc(),
    addLessLoader({
      javascriptEnabled: true,
    }),
    useEslintConfig(eslintConfig),
    useBabelRc(),
  ),
  jest: config => {
    // Customize Jest configuration here
    config.testMatch = ['**/__tests__/**/*.test.js']
    config.collectCoverageFrom = ['src/components/blaise/custom/*.js', 'src/helper/*.js']
    config.coveragePathIgnorePatterns = [
      'src/helper/upload-image.js',
      'src/helper/flag.js',
      'src/helper/index.js',
      'src/components/blaise/custom/DragableModal.js',
      'src/components/blaise/custom/GameTypeColumn.js',
      'src/components/blaise/custom/SelectMultipleAll.js',
      'src/components/blaise/custom/UploadImage.js',
      'src/components/blaise/custom/getTime.js',
      'src/components/blaise/custom/useColumnFilter.js',
      'src/components/blaise/custom/useInterval.js',
      'src/components/blaise/custom/useSearchParams.js',
      'src/components/blaise/custom/wrapperPopup.js',
    ]
    return config
  },
}

// src/helper/**/*.js', 'src/components/blaise/custom/**/*.js
// **/__tests__/**/*.test.js
// **/__tests__/pages/**/*.test.js
