# lizard
native syntax highlighter

## design goals

- fast, light.
  - native: `WebComponents`, `Range` [^1]

## todos

- [ ] get a simple [tokenizer][tok]
  - unfancy just to iterate on it
- [ ] a decent color mapper
- [ ] add minimal tests
- [ ] add a tiny benchmark
- [ ] review if it makes sense

## notes

[^1]: syntax highlighting w/o JS won't work. ok for now.

<!-- References -->

[tok]: https://en.wikipedia.org/wiki/Lexical_analysis#Tokenization
