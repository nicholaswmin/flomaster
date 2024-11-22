import test from 'node:test'
import { Tokenizer } from '../src/tokenizer.js'
  
test('lang:ecmascript', async t => {
  t.beforeEach(t => t.tokenize = (new Tokenizer()).tokenize)

  await t.test('argument[0]', async t => {
    await t.test('is not a string', async t => {  
      await t.test('throws descriptive TypeError', t => {
        t.assert.throws(() => t.tokenize(3333).next(), {
          name: 'TypeError', message: /must be string/
        })
      })
    })
  
    await t.test('is only whitespace', async t => {
      await t.test('throws descriptive RangeError', t => {
        t.assert.throws(() => t.tokenize(' ').next(), {
          name: 'RangeError', message: /is empty/
        })
      })
    }) 
  })
})
