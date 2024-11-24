import test from 'node:test'
import { Tokenizer } from '../index.js'
  
const noAnsicode = str => str.replace(/\u001b\[.*?m/g, '')
const noNewlines = str => str.trim().length > 0

test('lang:ecmascript', async t => {
  // Setup so it fails on numerical characters.
  t.beforeEach(t => t.t = new Tokenizer([
   	{ matcher: /[ \t]+/, type: null },
   	{ matcher: /\r?\n/, type: null },
   	{ matcher: /[a-zA-z]/, type: null },
  ]))
  
  // 3rd line has an invalid number
  const source = `
    LoremipsumdemipsumdolorLorem
    mipsumdolormipsumdolormipsumdolor
    dolo3rLomipsumdolor
    ipsumdolor
    sumdolor
    `

  await t.test('source has an invalid character', async t => {
    await t.test('throws a SyntaxError', async t => {
      t.assert.throws(() => [...t.t.tokenize(source)], {
        name: 'SyntaxError'
      })
    })
    
    await t.test('error message', async t => {
      await t.test('includes line number', async t => {
        t.assert.throws(() => [...t.t.tokenize(source)], {
          name: 'SyntaxError',
          message: /Line: 2/
        })
      })
  
      await t.test('includes column number', async t => {
        t.assert.throws(() => [...t.t.tokenize(source)], {
          name: 'SyntaxError',
          message: /Column: 4/
        })
      })
    })
  })
})
