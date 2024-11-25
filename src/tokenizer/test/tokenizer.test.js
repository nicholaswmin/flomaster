import test from 'node:test'
import { Tokenizer } from '../index.js'

test('lang:ecmascript', async t => {
  t.beforeEach(t => t.t = new Tokenizer())

  await t.test('argument[0]', async t => {
    await t.test('is not a string', async t => {  
      await t.test('throws descriptive TypeError', t => {
        t.assert.throws(() => t.t.tokenize(3333).next(), {
          name: 'TypeError', message: /string, is: number/
        })
      })
    })
  
    await t.test('is only whitespace', async t => {
      await t.test('throws descriptive RangeError', t => {
        t.assert.throws(() => t.t.tokenize(' ').next(), {
          name: 'RangeError', message: /empty/
        })
      })
    }) 
  })
})
