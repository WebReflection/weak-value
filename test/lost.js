const WeakValue = require('../cjs');

const k = 'key';
const wv = new WeakValue();

const v = (() => {
  const v1 = { foo: 1};
  const v2 = { foo: 2};
  wv.set(k, v1);
  wv.set(k, v2);
  return v2;
})();

setTimeout(() => {
  gc();
  const shouldBeV = wv.get(k);
  console.assert(shouldBeV === v);
});
