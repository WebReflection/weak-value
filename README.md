# WeakValue

A Map with weakly referenced values, instead of keys.

In Node.js, it requires [V8 release v8.4](https://v8.dev/blog/v8-release-84) or greater.

```js
import WeakValue from 'weak-value';
// const WeakValue = require('weak-value');

const wv = new WeakValue;

(() => {
  const value = {};
  wv.set('any-key', value);
})();
```
