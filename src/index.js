import { Tokenizer } from './lang/es/index.js'

const tokenizer = new Tokenizer()
const handleErr = (err, msg) => { throw new err(msg) }
const normalize = arg => {
	return typeof arg === 'string' 
	  ? arg.trim().length ? arg.trim()
			: handleErr(RangeError, 'arg[0] is empty')
		: handleErr(TypeError, `arg[0] must be a string, is: ${typeof arg}`)
}

const highlight = textContent => {
  const source = normalize(textContent)

  return [...tokenizer.tokenize(source)]
}

export { highlight }
