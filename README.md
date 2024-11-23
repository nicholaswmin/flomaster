# flomaster

<img src="https://github.com/user-attachments/assets/797123a3-f70c-4128-a47c-babb2bdbfdb1" title="This is 'James', a colour-camouflaging chameleon who used to star in those LG TV's sample videos you see in the malls. His real name is actually 'Alizavras' and he comes from Xylotympou, a nice village in Cyprus.'. Courtesy of icons8.com" width="72">

fast syntax highlighting [WIP]

## why

While browser based syntax highlighters slightly differ,  
they all follow the same fundamental process:  
 
1. [Lexical Tokenization][tok] of raw source code
2. Wrapping *each* token in a DOM element 
3. CSS selection

Step 2 is an awkward mechanism which triggers [layout reflow][rfl][^1] in   
the main thread, hence contributing to "jank" and [First-Meaningful Paint][fmp]   
delays. Additionally, it enlarges the DOM further exacerbating the issue.          

This prototype attempts an alternative method using position offsets,  
so it (should) avoid these issues altogether. Simply put: it's *faster*.  


## todos

- [x] get non-fancy [tokenizer][tok] to iterate upon:
    - [x] return shape: `[{ token: 'keyword', start: 5, end: 10 }]`
    - [x] add minimal tests
    - [ ] the tokenizer falls over some regex,     
          see notes in test.
- [ ] a decent color mapper
- [ ] add a small benchmark
  - [ ] decide on the parameters *before* you start
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
