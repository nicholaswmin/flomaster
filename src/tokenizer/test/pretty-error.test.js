import test from 'node:test'
import { PrettySyntaxError } from '../errors.js'

// note: dont ident `source`
const noAnsi = err => err.replace(/\u001b\[.*?m/g, '')
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
    await t.test('is an instanceof SyntaxError', t => {
      t.assert.strictEqual(err instanceof SyntaxError, true)
    })

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
    let err, window = {}, vendors = ['Apple Computer, Inc.', 'Google Inc.']

    t.after(() => delete globalThis.window )   
    t.before(() => { 
      // trick it so it thinks env = browser
      globalThis.window = { 
        console: { log: () => {} },
        navigator: { vendor: vendors[0] } 
      }
    })
  
    t.beforeEach(() => {
      err = new PrettySyntaxError('foo', { source, offset: 1 })
    })
    
    for (const vendor of vendors)  {
      await t.test(vendor, async t => {
        globalThis.window.navigator.vendor = vendor
        
        await t.test('is an instanceof SyntaxError', t => {
          t.assert.strictEqual(err instanceof SyntaxError, true)
        })
    
        await t.test('logs the error message', t => {
          t.assert.strictEqual(err.message, 'foo')
        })
        
        await t.test('logs the line number', async t => {
          t.assert.ok(err.cause.includes('Line: 1'), err.message)
        })
        
        await t.test('logs the column number', async t => {
          t.assert.ok(err.cause.includes('Column: 2'), err.message)
        })
        
        await t.test('visually points the correct source column', async t => {
          const lines = err.cause.split('\n')
          t.assert.strictEqual(lines.at(2), 'foo')
          t.assert.strictEqual(lines.at(3), ' ⇩')
          t.assert.strictEqual(lines.at(4), 'LoremipsumdemipsumdolorLorem')
          t.assert.strictEqual(lines.at(5), ' ⇧')
        }) 
      }) 
    }
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
