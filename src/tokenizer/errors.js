/*
Set of coloring/layout utilities for generating  
pretty errors of the source itself, the raw text we're tokenizing.

- Isomorphic, pretty prints in Node.js + browser.
- The line classes allows declaring how we want it to be displayed.
  The class itself makes the decision, based on the environment.
  
  @nicholaswmin, MIT License
*/

class Lines {
  constructor(lines) {
    this.lines = lines
  }
  
  toString() {
    return this.lines
      .reduce(this.collect.bind(this), '')
  }
  
  collect(str, line) {
    return str += line.toString()
  } 

  isBrowser() {
    return typeof process === 'undefined' ||
      !Object.hasOwn(process || {}, 'env')
  }
}

class Line {
  static colors = {
    'reset': '0', 'red': '31', 'green': '32', 'yellow': '33', 
    'blue': '34', 'magenta': '35', 'cyan': '36', 'white': '37'
  }

  constructor(text, color = 'white', offset, { center = false } = {}) {
    this.text = this.pad(text, offset, { center })
    this.color = color
  }
  
  toString() {
    return this.colorize(this.color, this.text)
  }
  
  log() {
    console.log(`%c ${this.text}`, `color: ${this.color}`)
  }
  
  colorize(name = 'white', ...args) {
    return Line.canColor() 
      ? `\x1b[${Line.colors[name] || '37'}m${args.join(' ')}\x1b[0m` 
      : args.join()
  }
  
  // The rules captured in that method follow guidelines outlined here:
  // - NO_COLOR: https://no-color.org/
  //
  // They also attempt to iron-over some inconsistencies:
  // - https://github.com/nodejs/help/issues/4507
  static canColor() {
    const IS_TEST = () => typeof process !== 'undefined'
      && process.env?.NODE_ENV === 'test'

    const NO_COLOR = () => typeof process?.env?.NO_COLOR !== 'undefined' 
      || process?.argv?.includes('--no-color')

    const FORCE_COLOR = () => typeof process?.env?.FORCE_COLOR !== 'undefined'
      || process?.argv?.includes('--color')

    const isTTY = () => !!process.stdout?.isTTY || 
      typeof process.env.NODE_TEST_CONTEXT !== 'undefined'
    
    if (NO_COLOR())
      return false
    
    if (FORCE_COLOR() || isTTY() || IS_TEST())
      return true

    return false
  }

  pad(text, offset, { center }) {
    const calc = offset - (center ? text.length / 2 : 0)
    return ' '.repeat(calc < 0 ? 0 : calc) + text
  }
}

class ColoredSourceError extends Error {
  constructor(message, { cause, source, offset }) {
    const lines = source.slice(0, offset).split('\n')
    const prior = lines.at(-1).trim()
    const after = source.slice(offset + 1, source.indexOf('\n', offset))
    const error = source.at(offset)

    super(new Lines([
      '\n', '\n',
      new Line(message, 'red', prior.length, { center: true }),
      '\n',
      new Line('⇩', 'red', prior.length),
      '\n',
      new Line(prior, 'green'), new Line(error, 'red'), new Line(after),
      '\n',
      new Line('⇧', 'red', prior.length),
      '\n',
      new Line(`Line: ${lines.length - 1}`),
      '\n',
      new Line(`Column: ${prior.length}`),
      '\n'
    ]), { cause })

    this.name = this.constructor.name
  }
}

export { ColoredSourceError }
