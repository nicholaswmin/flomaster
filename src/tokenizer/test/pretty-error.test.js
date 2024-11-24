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

  await t.test('error message layout', async t => {
    await t.test('is ANSI-code colored', async t => {
      // 31m is ANSI CODE for red, if included, it's colored.
      t.assert.throws(() => [...t.t.tokenize(source)], {
        name: 'SyntaxError',
        message: /31m/
      })
    })
    
    await t.test('visually points the source column', async t => {
      try {
        [...t.t.tokenize(source)]
      } catch ({ message }) {
        t.assert.deepStrictEqual(message.split('\n')
          .map(noAnsicode).filter(noNewlines), [
            'Invalid token',
            '    ⇩',
            'dolo3rLomipsumdolor',
            '    ⇧',
            'Line: 2',
            'Column: 4'
          ])
      }
    })
    
    await t.test('respects NO_COLOR/FORCE_COLOR env. variables', async t => {
      t.before(() => t.originalEnv = { ...process.env })     
      t.after(() => process.env = t.originalEnv)   
      t.beforeEach(() => {
        delete process.env.FORCE_COLOR
        delete process.env.NO_COLOR
      })       
     
     
      await t.test('NO_COLOR nor FORCE_COLOR is set', async t => {
        await t.test('uses colors', async t => {    
          t.assert.throws(() => [...t.t.tokenize(source)], {
            name: 'SyntaxError',
            message: /31m/
          })
        })
      }) 

      await t.test('NO_COLOR is set', async t => {
        await t.test('skips colors', async t => {    
          process.env.NO_COLOR = '1'          

          t.assert.throws(() => [...t.t.tokenize(source)], {
            name: 'SyntaxError',
            message: /dolo3rLomipsumdolor/
          })
        })
      })
      
      await t.test('both NO_COLOR and FORCE_COLOR are set', async t => {
        await t.test('skips colors', async t => {    
          process.env.FORCE_COLOR = '1'
          process.env.NO_COLOR = '1'
    
          t.assert.throws(() => [...t.t.tokenize(source)], {
            name: 'SyntaxError',
            message: /dolo3rLomipsumdolor/
          })
        })
      })
    })
  })
})
