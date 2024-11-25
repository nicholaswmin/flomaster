import test from 'node:test'
import { Tokenizer } from '../index.js'

// line: 3, col: 4 has a number rest is only alphabetical 
// note: dont ident `source`
const source = `LoremipsumdemipsumdolorLorem
mipsumdolormipsumdolormipsumdolor
dol3rLomipsumdolor
ipsumdolor
sumdolor
`

test('no match found', async t => {
  // Setup so it fails on numerical characters.
  t.beforeEach(t => t.t = new Tokenizer([
   	{ matcher: /[ \t]+/,   type: null },
   	{ matcher: /\r?\n/,    type: null },
   	{ matcher: /[a-zA-z]/, type: null }
  ]))

  await t.test('source has an invalid number', async t => {
    await t.test('throws a SyntaxError', async t => {
      t.assert.throws(() => [...t.t.tokenize(source)], {
        name: 'SyntaxError'
      })
    })
    
    await t.test('error message', async t => {
      await t.test('includes error message', async t => {
        t.assert.throws(() => [...t.t.tokenize(source)], {
          name: 'SyntaxError',
          message: /Invalid token/ 
        })
      })

      await t.test('includes line number', async t => {
        t.assert.throws(() => [...t.t.tokenize(source)], {
          name: 'SyntaxError',
          message: /Line: 3/ 
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
