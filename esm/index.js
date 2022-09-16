/*! (c) Andrea Giammarchi */

const {iterator} = Symbol;

const noop = () => {};

/**
 * A Map extend that transparently uses WeakRef around its values,
 * providing a way to observe their collection at distance.
 * @extends {Map}
 */
class WeakValue extends Map {
  #delete = (key, ref) => {
    super.delete(key);
    this.#registry.unregister(ref);
  };

  #get = (key, [ref, onValueCollected]) => {
    const value = ref.deref();
    if (!value) {
      this.#delete(key, ref);
      onValueCollected(key, this);
    }
    return value;
  }

  #registry = new FinalizationRegistry(key => {
    const pair = super.get(key);
    if (pair) {
      super.delete(key);
      pair[1](key, this);
    }
  });

  constructor(iterable) {
    super();
    if (iterable)
      for (const [key, value] of iterable)
        this.set(key, value);
  }

  clear() {
    for (const [_, [ref]] of super[iterator]())
      this.#registry.unregister(ref);
    super.clear();
  }

  delete(key) {
    const pair = super.get(key);
    return !!pair && !this.#delete(key, pair[0]);
  }

  forEach(callback, context) {
    for (const [key, value] of this)
      callback.call(context, value, key, this);
  }

  get(key) {
    const pair = super.get(key);
    return pair && this.#get(key, pair);
  }

  has(key) {
    return !!this.get(key);
  }

  set(key, value, onValueCollected = noop) {
    super.delete(key);
    const ref = new WeakRef(value);
    this.#registry.register(value, key, ref);
    return super.set(key, [ref, onValueCollected]);
  }

  *[iterator]() {
    for (const [key, pair] of super[iterator]()) {
      const value = this.#get(key, pair);
      if (value)
        yield [key, value];
    }
  }

  *entries() {
    yield *this[iterator]();
  }

  *values() {
    for (const [_, value] of this[iterator]())
      yield value;
  }
}

export default WeakValue;
