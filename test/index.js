const WeakValue = require('../cjs');

const wv = new WeakValue;

wv.set('key', {});

setTimeout(() => {
  console.log(wv.has('key'));
});
