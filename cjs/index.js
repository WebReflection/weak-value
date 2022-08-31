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
    return super.has(key) && !this.#delete(key);
  }
  has(key) {
    let has = super.has(key);
    if (has && !super.get(key).deref())
      has = !!this.#delete(key);
    return has;
  }
  get(key) {
    const ref = super.get(key);
    if (ref && ref.deref() === undefined && this.#delete(key)) return;
    return ref && ref.deref();
  }
  set(key, value) {
    this.delete(key);
    const ref = new WeakRef(value);
    this.#registry.register(value, key, ref);
    return super.set(key, ref);
  }
};
