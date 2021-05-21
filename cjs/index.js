'use strict';
module.exports = class WeakValue extends Map {
  #delete = key => {
    this.#registry.unregister(super.get(key));
    super.delete(key);
  };
  #registry = new FinalizationRegistry(key => {
    super.delete(key);
  });
  delete(key) {
    const had = super.has(key);
    if (had)
      this.#delete(key);
    return had;
  }
  has(key) {
    let has = super.has(key);
    if (has) {
      const ref = super.get(key);
      has = ref.deref() !== void 0;
      if (!has)
        this.#delete(key);
    }
    return has;
  }
  get(key) {
    const ref = super.get(key);
    return ref && ref.deref();
  }
  set(key, value) {
    if (super.has(key))
      this.#delete(key);
    const ref = new WeakRef(value);
    this.#registry.register(value, key, ref);
    return super.set(key, ref);
  }
};
