const WeakValue = require('../cjs');

const wv = new WeakValue([['key', {a: 1}]]);
const collected = [];

const onValueCollected = key => {
  collected.push(key);
};

console.assert(wv.has('key'), 'key is present');
console.assert(wv.delete('key'), 'key is removed');
console.assert(!wv.delete('key'), 'key is not removed');

setTimeout(() => {
  gc();
  console.assert(collected.length === 0, 'onValueCollected never invoked');

  wv.set('key', {a: 2}, onValueCollected);
  wv.set('key', {a: 3}, onValueCollected);
  console.assert(wv.get('key').a === 3, 'key is the correct one');

  console.assert(collected.length === 0, 'onValueCollected not invoked yet');

  setTimeout(() => {
    gc();
    console.assert(collected.length === 0, 'onValueCollected not invoked after');
    console.assert(!wv.has('key'), 'key is collected');
    console.assert(collected.length === 1, 'onValueCollected invoked once');
    wv.set('key', {a: 4}, onValueCollected);

    // covers automatic delete
    setTimeout(() => {
      gc();
      console.assert(collected.length === 2, 'onValueCollected invoked more');

      wv.set('key', {a: 5});

      // cover usage of noop
      setTimeout(() => {
        gc();

        const invokes = [];
        const a = {};
        wv.set('a', a);
        wv.forEach(function (value, key, map) {
          invokes.push(value, key, map, this);
        }, a);
        console.assert(invokes[0] === a && invokes[1] === 'a' && invokes[2] === wv && invokes[3] === a);
        invokes.splice(0);

        for (const [key, value] of wv) invokes.push(key, value);
        console.assert(invokes[0] === 'a' && invokes[1] === a);
        invokes.splice(0);

        for (const [key, value] of wv.entries()) invokes.push(key, value);
        console.assert(invokes[0] === 'a' && invokes[1] === a, 'entries()');
        invokes.splice(0);

        for (const key of wv.keys()) invokes.push(key);
        console.assert(invokes[0] === 'a', 'keys()');
        invokes.splice(0);

        for (const value of wv.values()) invokes.push(value);
        console.assert(invokes[0] === a, 'values()');
        invokes.splice(0);

        wv.clear();
      });
    });
  });

});
