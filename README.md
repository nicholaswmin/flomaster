# flomaster

fast syntax highlighting [WIP]

## why

Following [lexical tokenization][tok], the top 3 syntax highlighters  
wrap each token in DOM elements to render them targetable via CSS;  
a problematic mechanism that triggers [reflow][rfl][^1] in the main thread,      
hence contributing to "jank" and [First-Meaningful Paint][fmp] delays.            

This prototype attempts an alternative method using position offsets,  
so it (should) avoid these issues altogether. Simply put: it's *faster*.

## todos

- [ ] get non-fancy [tokenizer][tok] to iterate upon:
  - return shape: `[{ token: 'keyword', start: 5, end: 10 }]`
  - add minimal tests
- [ ] a decent color mapper
- [ ] add a small benchmark
- [ ] review if it makes sense

## license

> MIT License  
>
> Copyright (c) 2024 Nicholas Kyriakides 
>
> Permission is hereby granted, free of charge, to any person obtaining     
> a copy of this software and documentation files (the "Software"), to    
> deal  in the Software without restriction, including without limitation   
> the rights  to use, copy, modify, merge, publish, distribute, sublicense,   
> and/or sell  copies of the Software, and to permit persons to whom the   
> Software is furnished to do so, subject to the following conditions:     
> 
> The above copyright notice and this permission notice shall be    
> included in all copies or substantial portions of the Software.      

## footnotes

[^1]: this is distinct from *forced synchronous layout reflow*, the reflow
      that is triggered by accessing certain geometric APIs. Both are types
      of reflow.

   
<!-- References -->

[tok]: https://en.wikipedia.org/wiki/Lexical_analysis#Tokenization
[fmp]: https://developer.mozilla.org/en-US/docs/Glossary/First_meaningful_paint
[dom]: https://en.wikipedia.org/wiki/Document_Object_Model
[rfl]: https://developer.mozilla.org/en-US/docs/Glossary/Reflow
[bnk]: https://www.chromium.org/blink/
