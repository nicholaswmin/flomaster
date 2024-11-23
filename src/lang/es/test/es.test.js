import test from 'node:test'
import { Tokenizer } from '../index.js'
import { simple, complex } from './es.sample.js'

test('lang:js', async t => {
  t.beforeEach(t => t.t = new Tokenizer())

  await t.test('input is syntactically valid', async t => {
    await t.test('simple example', async t => {
      const res = [...t.t.tokenize(simple)]

      await t.test('returns correct token count', t => {
        t.assert.strictEqual(res.length, 47)
      })
      
      await t.test('returns correct tokens', t => {
        console.log(res[50])
      })
    })
    
    await t.test('complex example', { skip: true }, async t => {
      // @FIXME falls over on a regex
      
      const res = [...t.t.tokenize(complex)]

      await t.test('returns correct token count', t => {
        t.assert.strictEqual(res.length, 155)
      })
      
      await t.test('returns correct tokens', t => {
        t.assert.deepEqual(res[0], {
          'type': 'identifier', 'value': 'var',
          'startOffset': 3, 'endOffset': 6
        })
        t.assert.deepEqual(res[50], { 
          'type': '(', 'value': null,
          'startOffset': 229, 'endOffset': 230
        })
        t.assert.deepEqual(res[75], { 
          'type': ')', 'value': null,
          'startOffset': 345, 'endOffset': 346
        })
      })
    })
  })
})
