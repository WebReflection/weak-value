export default class WeakValue extends Map {
  #registry = new FinalizationRegistry(key => {
    // the Map could have manually removed the key already
    // or it could've changed it by the time the previous
    // reference was GC'd, hence the double check
    if (this.has(key)) {
      const value = super.get(key);
      if (value && value.deref())
        this.delete(key);
    }
  });
  get(key) {
    const value = super.get(key);
    return value && value.deref();
  }
  set(key, value) {
    if (this.has(key))
      this.#registry.unregister(this.get(key));
    this.#registry.register(value, key);
    return super.set(key, new WeakRef(value));
  }
};
