// A generic tokenizer/scanner. 
// Each language should extend with its own tokens.   
// - Based on jsparse: ndesmic, MIT License

import { styleText } from 'node:util'

const END = Symbol('END')

class Tokenizer {
	constructor(tokens) {  
		this.tokens = tokens
	}

	*tokenize(str) {
	  str = Tokenizer.normalize(str)

		let i = 0

		while (i < str.length) {
			let hasMatch = false

			for (const { matcher, type, extractor } of this.tokens) {
				const currentMatcher = new RegExp(matcher.source, 'y')
				currentMatcher.lastIndex = i
				const matched = currentMatcher.exec(str)

				if (matched !== null) { 
					i += matched.at(0).length

					if (type != null) {
						const token = { type }

						if (extractor)
							token.value = extractor(matched.at(0))

						yield token
					}

					hasMatch = true  
				}
			}
		
			if (!hasMatch) { 
			  // show a bit more context around the error position.
			  const ctx = styleText('green', str.slice(i - 20, i - 1).trim())
				const err = styleText('red', str.slice(i, i + 5).trim())
        throw new SyntaxError(`Unexpected token at pos: ${i} => ${ctx}${err}`)
			}
		}

		yield { type: END }
	}
	
	static normalize(arg) {
		return typeof arg === 'string' 
		  ? arg.trim().length ? arg.trim()
				: Tokenizer.throw(RangeError, 'is empty')
			: Tokenizer.throw(TypeError, `arg. must be string, got: ${typeof arg}`)

	}

	static throw(err, msg) {
	 throw new err(msg)
	}
}

export { END, Tokenizer }
