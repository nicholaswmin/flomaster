import test from 'node:test'
import { PrettySyntaxError } from '../errors.js'

// note: dont ident `source`
const noAnsi = str => str.replace(/\u001b\[.*?m/g, '')
const source = `LoremipsumdemipsumdolorLorem
mipsumdolormipsumdolormipsumdolor
dol3rLomipsumdolor
ipsumdolor
sumdolor
`

test('SyntaxError: pretty printing', async t => {  
  const err = new PrettySyntaxError('Foobars Foob', { source, offset: 63 })
  const lines = noAnsi(err.message).split('\n')

  await t.test('nodejs', async t => {
    await t.test('logs the error message', t => {
      t.assert.ok(err.message.includes('Foobars Foo'))
    })
  
    await t.test('logs the line number', async t => {
      t.assert.ok(err.message.includes('Line: 3'), err.message)
    })
    
    await t.test('logs the column number', async t => {
      t.assert.ok(err.message.includes('Column: 1'), err.message)
    })
  
    await t.test('column is close to gutter', async t => {
      await t.test('visually points the correct source column', async t => {
        t.assert.strictEqual(lines.at(2), 'Foobars Foob')
        t.assert.strictEqual(lines.at(3), '⇩')
        t.assert.strictEqual(lines.at(4), 'dol3rLomipsumdolor')
      })
    })   
    
    await t.test('column is far from gutter', async t => {
      const err = new PrettySyntaxError('Foobars Foob', { source, offset: 70 })
      const lines = noAnsi(err.message).split('\n')
  
      await t.test('visually points the correct source column', async t => {
        t.assert.strictEqual(lines.at(2), ' Foobars Foob')
        t.assert.strictEqual(lines.at(3), '       ⇩')
        t.assert.strictEqual(lines.at(4), 'dol3rLomipsumdolor')
      })
    })  
  })
  
  await t.test('browser', async t => {
    let err, logs, logged, window = { 
      console: { log: () => {} 
    }}

    t.before(() => { 
      t.mock.method(globalThis.console, 'log')
      // trick it so it thinks env = browser
      globalThis.window = true 
    })
  
    t.after(() => {
      globalThis.console.log.mock.restore()
      delete globalThis.window
    })   

    t.beforeEach(() => {
      err = new PrettySyntaxError('foo', { source, offset: 1 })
      logs = globalThis.console.log.mock.calls
      logged = logs.at(0).arguments.join('\n')
    })
    
    await t.test('logs the error message', t => {
      t.assert.strictEqual(err.message, 'foo')
    })
    
    await t.test('logs the line number', async t => {
      t.assert.ok(logged.includes('Line: 1'), logged)
    })
    
    await t.test('logs the column number', async t => {
      t.assert.ok(logged.includes('Column: 2'), logged)
    })
    
    await t.test('visually points the correct source column', async t => {
      const lines = logged.replaceAll('%c', '').split('\n')
      
      t.assert.strictEqual(lines.at(2), 'foo')
      t.assert.strictEqual(lines.at(3), ' ⇩')
      t.assert.strictEqual(lines.at(4), 'LoremipsumdemipsumdolorLorem')
      t.assert.strictEqual(lines.at(5), ' ⇧')
    })
    
    await t.test('in monospace', t => {
      const css = logs.at(0).arguments.filter(a => a.includes(';'))
      t.assert.ok(css.every(a => a.includes('monospace')))
    })
  })
  
  await t.test('colors', async t => {
    const err = new PrettySyntaxError('foo', { source, offset: 1 })
  
    await t.test('is ANSI-code colored', async t => {
      // 31m is ANSI CODE for red, if included, it's colored.
      t.assert.ok(err.message.includes('31m'))
    })
    
    await t.test('respects color env. variables', async t => {
      t.before(() => t.originalEnv = { ...process.env })     
      t.after(() => process.env = t.originalEnv)   
      t.beforeEach(() => {
        delete process.env.FORCE_COLOR
        delete process.env.NO_COLOR
      })       
    
    
      await t.test('NO_COLOR nor FORCE_COLOR is set', async t => {
        await t.test('is ANSI-code colored', async t => {
          t.assert.ok(err.message.includes('31m'))
        })
      }) 
  
      await t.test('NO_COLOR is set', async t => {
        process.env.NO_COLOR = '1'          
        const err = new PrettySyntaxError('foo', { source, offset: 1 })
  
        await t.test('skips colors', async t => {             
          t.assert.ok(!err.message.includes('31m'))
        })
      })
      
      await t.test('both NO_COLOR and FORCE_COLOR are set', async t => {
        process.env.FORCE_COLOR = '1'
        process.env.NO_COLOR = '1'
        const err = new PrettySyntaxError('foo', { source, offset: 1})
  
        await t.test('skips colors', async t => {    
          t.assert.ok(!err.message.includes('31m'))
        })
      })
    })
  })
})
