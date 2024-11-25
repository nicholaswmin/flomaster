/*
Pretty Syntax Errors
@nicholaswmin, MIT License

A SyntaxError that pretty-prints the exact error column, in the source.
- Isomorphic, pretty prints in Node.js + browser.
- Respects `FORCE_COLOR`, `NO_COLOR` env. variables.
- This only makes sense if you're building the compiler/tokenizer/lexer itself since it 
  illuminates a given `source`. It's not standard `SyntaxError` substitute.

## Usage:

```
import { PrettySyntaxError } from './errors.js'

const offset = 41
const source = `
  let exponentiation = => 3 ** 4;
  let 3foo = 'bar';
  let bang_bang_ure_boolean = x => !!x;
`

throw new PrettySyntaxError('Invalid token', { source, offset })

' Error: SyntaxError  '
'                     '
'  Invalid token      '
'      ⇩              '
'..let 3foo = 'bar';  ' 
'      ⇧              '
'                     '
'  Line: 2            '
'  Column: 4          '
```
*/

const envIsBrowser = () => globalThis !== 'undefined' && 
  Object.hasOwn(globalThis, 'window')

const browserIsSafari = () => {
  return envIsBrowser() && 
    globalThis?.window
      ?.navigator?.vendor
      ?.toLowerCase().includes('apple')
}

class Lines {
  constructor(message, lines) {
    this.message = message
    this.lines = lines
  }
    
  toString() {
    // Safari doesn't display `err.cause` in its DevTools,
    // so we gotta log it to the console at least
    return browserIsSafari() 
      ? this.logAndJoin(this.lines)
      : this.join(this.lines)  
  }
  
  join(lines) {
    return lines.reduce((acc, l) => acc + 
      (this.constructor.canColor() ? 
        l.toANSIString() : 
        l.toString()), '')
  }
  
  logAndJoin(lines) {
    const joined = this.join(lines)
    
    // log in monospace to avoid alignemnt issues
    globalThis.console.error(`%c${joined}`, 'font-family: monospace;')

    return joined
  }
  
  // - Normally we'd use `process.stdout.isTTY` but, 
  //   theres an issue: https://github.com/nodejs/help/issues/4507
  // - Follows guidelines: https://no-color.org/
  static canColor() {
    const defined = v => typeof v !== 'undefined'
    
    const IS_TEST = () => defined(process)
      && process.env?.NODE_ENV === 'test'

    const NO_COLOR = () => defined(process.env.NO_COLOR) 
      || process?.argv?.includes('--no-color')

    const FORCE_COLOR = () => defined(process.env.FORCE_COLOR) 
      || process?.argv?.includes('--color')

    const isTTY = () => !!process.stdout?.isTTY || 
      typeof process.env.NODE_TEST_CONTEXT !== 'undefined'

    return envIsBrowser() || NO_COLOR() 
      ? false : FORCE_COLOR() || isTTY() || IS_TEST()
  }
}

class Line {
  static colors = {
    'reset': '0', 'red': '31', 'green': '32', 'yellow': '33', 
    'blue': '34', 'magenta': '35', 'cyan': '36', 'white': '37'
  }

  constructor(str, color = 'white', offset, { center = false } = {}) {
    this.str = this.pad(str, offset, { center })
    this.color = color
  }
  
  toString() {
    return this.str
  }

  toANSIString() {
    return `\x1b[${Line.colors[this.color] || '37'}m${this.str}\x1b[0m` 
  }

  pad(str, offset, { center }) {
    return ' '.repeat(Math.max(0, offset - (center ? str.length / 2 : 0))) + str
  }
}

class Linebreak extends Line {
  constructor(lines = 1) {
    super('\n'.repeat(Math.max(1, lines)), 'white', 0)
  }
}

class PrettySyntaxError extends SyntaxError {
  constructor(message, { cause, source, offset }) {
    const splat = source.slice(0, offset).split('\n')
    const prior = splat.at(-1).trim()
    const after = source.slice(offset + 1, source.indexOf('\n', offset))
    const error = source.at(offset)
    const lines = new Lines(message, [
      new Linebreak(2),
      new Line(message, 'red', prior.length, { center: true }),
      new Linebreak(),
      new Line('⇩', 'red', prior.length),
      new Linebreak(),
      new Line(prior, 'green'), new Line(error, 'red'), new Line(after),
      new Linebreak(),
      new Line('⇧', 'red', prior.length),
      new Linebreak(),
      new Line(`Line: ${splat.length}`),
      new Linebreak(),
      new Line(`Column: ${prior.length + 1}`),
      new Linebreak()
    ])

    super(envIsBrowser() ? message : lines.toString(), { 
      cause: envIsBrowser() ? lines.toString() : 'parsing syntax error'
    })

    this.name = 'SyntaxError'
  }
}

export { PrettySyntaxError }
