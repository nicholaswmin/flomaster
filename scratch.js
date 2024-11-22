// just a playground file

import { tokenizer } from './src/lang/es.js'

const tk = tokenizer.tokenize(`
  const x= 3; 
  const y = z => console.log('hi');
`.trim())
console.log([...tk])
