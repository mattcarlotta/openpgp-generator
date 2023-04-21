const sortImportsPlugin = require('@ianvs/prettier-plugin-sort-imports')
const tailwindPlugin = require('prettier-plugin-tailwindcss')

module.exports = {
  semi: false,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  plugins: [
    {
      parsers: {
        typescript: {
          ...sortImportsPlugin.parsers.typescript,
          parse: tailwindPlugin.parsers.typescript.parse,
        },
      },
    },
  ],

  importOrder: ['^[./]'], // Seperates third-party from relative imports
  importOrderSeparation: false, // Line seperation between groups of imports
  importOrderCaseInsensitive: true,
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: false, // Keep type imports seperate from value imports
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ['typescript', 'jsx'],
}
