import test from 'node:test'
import Tokenizer from './index.js'
import { simple, complex } from './es.sample.js'

test('lang:js', async t => {
  t.beforeEach(t => t.t = new Tokenizer())

  await t.test('input is syntactically valid', async t => {
    await t.test('simple example', async t => {
      const res = [...t.t.tokenize(simple)]

      await t.test('returns correct token count', t => {
        t.assert.strictEqual(res.length, 47, 'no tokens found')
      })
      
      await t.test('returns correct tokens', t => {
        t.assert.deepStrictEqual(res[0], { type: 'const'})
        t.assert.deepStrictEqual(res[10], { type: 'let'})
        t.assert.deepStrictEqual(res[30], { type: 'identifier', value: 'n'})
      })
    })
    
    await t.test('complex example', async t => {
      const res = [...t.t.tokenize(complex)]

      await t.test('returns correct token count', t => {
        t.assert.strictEqual(res.length, 155, 'no tokens found')
      })
      
      await t.test('returns correct tokens', t => {
        t.assert.deepStrictEqual(res[0], { type: 'identifier', value: 'var' })
        t.assert.deepStrictEqual(res[50], { type: '(' })
        t.assert.deepStrictEqual(res[75], { type: ')' })
        t.assert.deepStrictEqual(res[120], { type: 'for' })
      })
    })
  })
})
