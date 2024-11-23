/*
Base Error Class with good coloring utilities.

- Isomorphic, meant to work across Node.js + browser.

- The color method allows you to paint your messages without worrying
  if colors are supported. It infers it if such and replaces the color
  ANSI codes with whitespaces.

- Most interesting method is: `canColor`, which decides if 
  color should be emitted (or replaced with non-color whitespace).
  Since these errors are isomoprhic we can't use `.isTty()`.
  
  The rules captured in that method follow guidelines outlined here:
    - NO_COLOR: https://no-color.org/

  They also attempt to iron-over some inconsistencies:
    - https://github.com/nodejs/help/issues/4507
  */
  
/*
You should not instantiate this class. 

- Subclass it instead, and use its `color` method to create colored messages.
- A working example is show at the bottom.  
*/
class BaseColoredError extends Error {
  constructor(message, { cause } = {}) {
    super(message, { cause })
  }
  
  static color(name = 'white', ...args) {
    const ansicode = {
      'red': '31', 'green': '32', 'yellow': '33', 
      'blue': '34', 'magenta': '35', 'cyan': '36'
    }[name] || '37'

    return BaseColoredError.canColor(true) ? 
      ('\x1b[' + ansicode + 'm' + args.join(' ') + '\x1b[0m') : args.join(' ')
  }

  static canColor() {
    const IS_BROWSER = () => typeof process === 'undefined' ||
      !Object.hasOwn(process || {}, 'env')
    const IS_TEST = () => typeof process !== 'undefined'
      && process.env?.NODE_ENV === 'test'
    const NO_COLOR = () => typeof process?.env?.NO_COLOR !== 'undefined' 
      || process?.argv?.includes('--no-color')
    const FORCE_COLOR = () => typeof process?.env?.FORCE_COLOR !== 'undefined'
      || process?.argv?.includes('--color')
    const isTTY = () => !!process.stdout?.isTTY || 
      typeof process.env.NODE_TEST_CONTEXT !== 'undefined'
    
    if (IS_BROWSER())
      return false
    
    if (NO_COLOR())
      return false
    
    if (FORCE_COLOR())
      return true
    
    if (isTTY())
      return true
    else
      if (IS_TEST())
        return true
      
      return false
    }
}

/*
## SourceParsingError

This class highlights source code, assumed to be parsed within 
this process. "Yo dawg we heard you lik..."

It's very useful if you're building tokenizers or parsers,
since they show *exactly* which line and column in your source
is affected; providing good visual cues.

Without it, you're not gonna be able to debug much - the errors
will show numbers, lines and code that concern `this` process,
not the source code you're parsing.

An example: 

### Usage

You throw it as an error, when applicable.

- `source`: The entire source code that's being parsed: a string`
- `offset`: the current character `position` you're parsing: a `number`
  - a.k.a: `offset`
  - a.k.a: `index`
  - a.k.a: `i`

```js
// throwing the error 
// assume we hit a snag on the 50th character. 
// (dont mind newlines, just go)

throw new SourceParsingError('Invalid token', { source, offset: 50 })
```

which renders:

```bash
Error [SourceParsingError]: 
          Invalid token
               ⇩
if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
               ⇧
line: 14
column: 15

- at ESTokenizer.tokenize (file:///Users/...)
- at tokenize.next (<anonymous>)
*/

class SourceParsingError extends BaseColoredError {
  constructor(message, { cause, source, offset }) {
    const lines = source.slice(0, offset).split('\n')
    const prior = lines.at(-1).trim()
    const after = source.slice(offset + 1, source.indexOf('\n', offset))
    const color = BaseColoredError.color.bind(BaseColoredError)
    
    super([
      '\n',
      color('red', ' '.repeat(Math.abs(prior.length - message.length / 3)) + message),
      color('red', ' '.repeat(prior.length) + '⇩'),
      color('green', prior) + 
        color('red', source.at(offset)) + after,
      color('red', ' '.repeat(prior.length) + '⇧'),
      color('white', 'line:', lines.length - 1),
      color('white', 'column:', prior.length),
      '\n'
    ].join('\n'), { cause })

    this.name = this.constructor.name
  }
}

export { SourceParsingError }
