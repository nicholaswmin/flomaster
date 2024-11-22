// language-specific code samples, for examples & tests.
// - simple : 50+ tokens
// - complex: 150+ tokens
// 
// @FIXME The commented out regex in 'complex' breaks the parser.


const simple = `
  const isPrime = (n) => {
    for (let c = 2; c <= Math.sqrt(n); ++c) {
      if (n % c === 0) {
        return false;
      }
    }
    return true;
  }
`

const complex = `
  var aggregation = (baseClass, ...mixins) => {
    let base = class _Combined extends baseClass {
      constructor(...args) {
        super(...args);
        mixins.forEach((mixin) => {
          mixin.prototype.initializer.call(this);
        });
      }
    };
    let copyProps = (target, source) => {
      Object.getOwnPropertyNames(source)
        .concat(Object.getOwnPropertySymbols(source))
        .forEach((prop) => {
          // @REVIEW The following regex breaks the parser
          // if (prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
          //  return
          Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop))
        })
    }
    mixins.forEach((mixin) => {
      copyProps(base.prototype, mixin.prototype);
      copyProps(base, mixin);
    });
    return base;
  };  
`

export { simple, complex }
