import test from 'node:test'
import { Tokenizer } from '../index.js'

const decolor = str => str.replace(/\u001b\[.*?m/g, '')
const noNewlines = str => str.trim().length > 0

test('lang:ecmascript', async t => {
  // Setup some very basic matchers
  // only alphabetical + ends. Numbers are invalid
  t.beforeEach(t => t.t = new Tokenizer([
   	{ matcher: /[ \t]+/, type: null },
   	{ matcher: /\r?\n/, type: null },
   	{ matcher: /[a-zA-z]/, type: null },
  ]))
  
  // Theres a hidden, invalid, number: 3 in this source.
  const source = `
    LoremipsumdemipsumdolorLorem
    mipsumdolormipsumdolormipsumdolor
    dolo3rLomipsumdolor
    ipsumdolor
    sumdolor
    `

  await t.test('arg[0] has an invalid character', async t => {
    await t.test('throws a SourceParsingError', async t => {
      t.assert.throws(() => [...t.t.tokenize(source)], {
          name: 'SourceParsingError'
      })
    })
    
    await t.test('includes ANSI colors', async t => {
      // 31m is part of the ANSI CODE for red.
      t.assert.throws(() => [...t.t.tokenize(source)], {
        name: 'SourceParsingError',
        message: /31m/
      })
    })
    
    // https://no-color.org/
    await t.test('respects env.NO_COLOR', async t => {
      t.before(() => process.env.NO_COLOR = '1')
      t.after(() => process.env.NO_COLOR = undefined)
      
      // `dolo3rLomipsumdolor` would render jumbled-up 
      // full of ANSI colors, if there was color
      t.assert.throws(() => [...t.t.tokenize(source)], {
        name: 'SourceParsingError',
        message: /dolo3rLomipsumdolor/
      })
    })
    
    await t.test('visually points to the exact column', async t => {
      try {
        [...t.t.tokenize(source)]
      } catch ({ message }) {
        t.assert.deepStrictEqual(message.split('\n')
            .map(decolor).filter(noNewlines), [
              'Invalid token',
              '    ⇩',
              'dolo3rLomipsumdolor',
              '    ⇧',
              'line: 2',
              'column: 4'
            ])
      }
    })
  })
})
