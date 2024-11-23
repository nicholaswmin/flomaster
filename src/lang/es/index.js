import { Tokenizer } from '../../tokenizer/index.js';

class ESTokenizer extends Tokenizer {
  constructor() {
    super([
     	{ matcher: /[ \t]+/, type: null },
     	{ matcher: /\r?\n/, type: null },
     	{ matcher: /\/\/(.*?)(?=\r?\n|$)/, 
      	 type: 'comment', 
        extractor: v => v.slice(2) 
      },
     	{ matcher: /'[^'\r\n]+'/, 
      	 type: 'string-literal',
        extractor: v => v.slice(1, -1) 
      },
     	{ matcher: /'[^'\r\n]+'/, 
      	 type: 'string-literal', 
        extractor: v => v.slice(1, -1) 
      },
     	{ matcher: /`[^`]+`/, 
      	 type: 'string-literal', 
        extractor: v => v.slice(1, -1)
      },
     	{ matcher: /-?[0-9]+\.?[0-9]*(?![a-zA-Z$_])/, 
      	 type: 'number-literal', 
        extractor: v => parseFloat(v) 
      },
     	{ matcher: /{/, type: '{' },
     	{ matcher: /}/, type: '}' },
     	{ matcher: /\[/, type: '[' },
     	{ matcher: /\]/, type: ']' },
     	{ matcher: /\(/, type: '(' },
     	{ matcher: /\)/, type: ')' },
     	{ matcher: /;/, type: ';' },
     	{ matcher: /:/, type: ':' },
     	{ matcher: /,/, type: ',' },
     	{ matcher: /\.\.\./, type: '...' },
     	{ matcher: /\./, type: '.' },
     	{ matcher: /\*\*/, type: '**' },
     	{ matcher: /\*/, type: '*' },
     	{ matcher: /===/, type: '===' },
     	{ matcher: /==/, type: '==' },
     	{ matcher: /=>/, type: '=>' },
     	{ matcher: /=/, type: '=' },
     	{ matcher: /!==/, type: '!==' },
     	{ matcher: /!=/, type: '!=' },
     	{ matcher: /&&/, type: '&&' },
     	{ matcher: /&/, type: '&' },
     	{ matcher: /\^/, type: '^' },
     	{ matcher: /~/, type: '~' },
     	{ matcher: /!/, type: '!' },
     	{ matcher: /\|\|/, type: '||' },
     	{ matcher: /\|/, type: '|' },
     	{ matcher: /\+\+/, type: '++' },
     	{ matcher: /\+/, type: '+' },
     	{ matcher: /\-\-/, type: '--' },
     	{ matcher: /\-/, type: '-' },
     	{ matcher: /\\/, type: '\\' },
     	{ matcher: /%/, type: '%' },
     	{ matcher: /\?\?/, type: '??' },
     	{ matcher: /\?/, type: '?' },
     	{ matcher: />=/, type: '>=' },
     	{ matcher: /<=/, type: '<=' },
     	{ matcher: />>/, type: '>>' },
     	{ matcher: />/, type: '>' },
     	{ matcher: /<</, type: '<<' },
     	{ matcher: /</, type: '<' },
     	{ matcher: /null/, type: 'null' },
     	{ matcher: /true/, type: 'true', 
        extractor: v => v },
     	{ matcher: /false/, type: 'false', 
        extractor: v => v },
     	{ matcher: /import/, type: 'import' },
     	{ matcher: /export/, type: 'export' },
     	{ matcher: /from/, type: 'from' },
     	{ matcher: /as/, type: 'as' },
     	{ matcher: /for/, type: 'for' },
     	{ matcher: /while/, type: 'while' },
     	{ matcher: /in/, type: 'in' },
     	{ matcher: /of/, type: 'of' },
     	{ matcher: /break/, type: 'break' },
     	{ matcher: /continue/, type: 'continue' },
     	{ matcher: /do/, type: 'do' },
     	{ matcher: /if/, type: 'if' },
     	{ matcher: /else/, type: 'else' },
     	{ matcher: /switch/, type: 'switch' },
     	{ matcher: /case/, type: 'case' },
     	{ matcher: /default/, type: 'default' },
     	{ matcher: /function/, type: 'function' },
     	{ matcher: /return/, type: 'return' },
     	{ matcher: /yield/, type: 'yield' },
     	{ matcher: /await/, type: 'await' },
     	{ matcher: /try/, type: 'try' },
     	{ matcher: /catch/, type: 'catch' },
     	{ matcher: /finally/, type: 'finally' },
     	{ matcher: /throw/, type: 'throw' },
     	{ matcher: /typeof/, type: 'typeof' },
     	{ matcher: /new/, type: 'new' },
     	{ matcher: /class/, type: 'class' },
     	{ matcher: /super/, type: 'super' },
     	{ matcher: /let/, type: 'let' },
     	{ matcher: /const/, type: 'const' },
     	{ matcher: /this/, type: 'this' },
     	{ matcher: /[a-zA-Z$_][a-zA-Z0-9$_]*/, 
       	type: 'identifier', extractor: v => v }
    ])
  }
}

export { ESTokenizer as Tokenizer }
