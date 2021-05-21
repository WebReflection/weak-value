# WeakValue


[![Build Status](https://travis-ci.com/WebReflection/weak-value.svg?branch=master)](https://travis-ci.com/WebReflection/weak-value) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/weak-value/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/weak-value?branch=master)

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
