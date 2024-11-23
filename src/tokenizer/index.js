// A generic tokenizer/scanner. 
// Each language should extend with its own types.   
// - Based on jsparse: @ndesmic, MIT License
// 
// @REVIEW why is this a class and not just a pure function,
// which receives it's token types as argument?

import { SourceParsingError } from './errors.js'

const END = Symbol('END')

class Token {
  constructor({ offset, type, value = null }) {
    this.type = type
    this.value = value
    this.startOffset = offset
    this.endOffset = offset + (value?.length || 1)
  }
}

class Tokenizer {
	constructor(types) {  
		this.types = Object.freeze(types)
	}

	*tokenize(raw) {
		let offset = 0, source = Tokenizer.normalize(raw)

		while (offset < source.length) {
			let hasMatch = false

			for (const { matcher, type, extractor } of this.types) {
				const currentMatcher = new RegExp(matcher.source, 'y')
				currentMatcher.lastIndex = offset
				const matched = currentMatcher.exec(source)

				if (matched !== null) { 
					offset += matched.at(0).length

					if (type != null)
						yield extractor ? new Token({ 
						  offset, type, value: extractor(matched.at(0)) 
						}) : new Token({ offset, type })

					hasMatch = true  
				}
			}
			
			if (!hasMatch) 
			 throw new SourceParsingError('Invalid token', { source, offset })
		}

		yield { type: END }
	}
	
	static normalize(arg) {
		return typeof arg === 'string' 
		  ? arg.trim().length ? arg.trim()
				: Tokenizer.throw(RangeError, 'arg[0] is empty')
			: Tokenizer.throw(TypeError, `arg[0] must be a string, is: ${typeof arg}`)

	}

	static throw(err, msg) {
	  throw new err(msg)
	}
}

export { END, Tokenizer }
