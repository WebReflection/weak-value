const WeakValue = require('../cjs');

const wv = new WeakValue;

wv.set('key', {a: 1});
console.assert(wv.has('key'), 'key is present');
console.assert(wv.delete('key'), 'key is removed');
console.assert(!wv.delete('key'), 'key is not removed');

wv.set('key', {a: 2});
wv.set('key', {a: 3});
console.assert(wv.get('key').a === 3, 'key is the correct one');

setTimeout(() => {
  gc();
  console.assert(!wv.has('key'), 'key is collected');
  wv.set('key', {a: 4});

  // covers automatic delete
  setTimeout(() => {
    gc();
  });
});
