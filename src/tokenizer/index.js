// A generic tokenizer/scanner. 
// Each language should extend with its own types.   
// - Based on jsparse: @ndesmic, MIT License
// 
// @REVIEW why is this a class and not just a pure function,
// which receives it's token types as argument?

import { PrettySyntaxError } from './errors.js'

const END = Symbol('END')

class Token {
  constructor({ offset, type, value = null }) {
    this.type = type
    this.value = value
    this.startOffset = offset - String(value).length
    this.endOffset = offset
  }
}

class Tokenizer {
	constructor(types) {  
		this.types = Object.freeze(types)
	}

	*tokenize(source) {
		let offset = 0

		while (offset < source.length) {
			let hasMatch = false

			for (const { matcher, type, extractor } of this.types) {
				const currentMatcher = new RegExp(matcher.source, 'y')
				currentMatcher.lastIndex = offset
				const matched = currentMatcher.exec(source)

				if (matched !== null) { 
					offset += matched.at(0).length

					if (type != null)
						yield new Token({ offset, type, value: extractor 
								? extractor(matched.at(0)) 
								: matched.at(0)
						})

					hasMatch = true  
				}
			}
			
			if (!hasMatch) 
			 throw new PrettySyntaxError('Invalid token', { source, offset })
		}

		yield { type: END }
	}
}

export { END, Tokenizer }
