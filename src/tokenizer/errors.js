/*
Pretty Syntax Errors
@nicholaswmin, MIT License

A SyntaxError that pretty-prints the exact error column, in the source.
- Isomorphic, pretty prints in Node.js + browser.
- Respects `FORCE_COLOR` and `NO_COLOR` env. variables.
- This only makes sense if you're building the compiler/tokenizer/lexer 
  itself. It's not a SyntaxError substitute.

  ## Usage:

const offset = 41
const source = `
  let expoentiation = => 3 ** 4;
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
*/

class Lines {
  constructor(message, lines) {
    this.message = message
    this.lines = lines
  }
    
  toString() {
    return this.constructor.runsInBrowser() 
      ? this.log(this.lines).message
      : this.join(this.lines)  
  }
  
  join(lines) {
    return lines.reduce((acc, l) => acc + 
      (this.constructor.canColor() ? 
        l.toANSIString() : 
        l.toString()), '')
  }

  log(lines) {
    lines.reduce((loggable, l) => 
      loggable.addLine(l), 
      new ConsoleLoggable()).log()

    return this
  }

  static runsInBrowser() {
    return typeof process === 'undefined' ||
      !Object.hasOwn(process || {}, 'env')
  }
  
  // - The rules captured here follow guidelines   
  //   outlined here: https://no-color.org/   
  // - They also attempt to iron-over some inconsistencies:    
  //   https://github.com/nodejs/help/issues/4507
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

    return NO_COLOR() 
      ? false 
      : FORCE_COLOR() || isTTY() || IS_TEST()
  }
}

class ConsoleLoggable {
  constructor() {
    this.str = ''
    this.css = []
  }

  addLine(line) {
    this.addString(line.str, '%c')
    // @NOTE: monospace is required to ensure alignment.
    this.css.push(`color: ${line.color}; font-family:monospace;`)
    
    return this
  }
  
  addString(str, specifier = '') {
    this.str += specifier + str
    
    return this
  }
  
  log() {
    console.log(this.str, ...this.css)
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

class PrettySyntaxError extends Error {
  constructor(message, { cause, source, offset }) {
    const lines = source.slice(0, offset).split('\n')
    const prior = lines.at(-1).trim()
    const after = source.slice(offset + 1, source.indexOf('\n', offset))
    const error = source.at(offset)

    super(new Lines(message, [
      new Linebreak(2),
      new Line(message, 'red', prior.length, { center: true }),
      new Linebreak(),
      new Line('⇩', 'red', prior.length),
      new Linebreak(),
      new Line(prior, 'green'), new Line(error, 'red'), new Line(after),
      new Linebreak(),
      new Line('⇧', 'red', prior.length),
      new Linebreak(),
      new Line(`Line: ${lines.length - 1}`),
      new Linebreak(),
      new Line(`Column: ${prior.length}`),
      new Linebreak()
    ]), { cause })

    this.name = 'SyntaxError'
  }
}

export { PrettySyntaxError }
