class LruStore {
  constructor({ capacity }) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(id) {
    if (!this.map.has(id)) return undefined;
    const value = this.map.get(id);
    this.map.delete(id);
    this.map.set(id, value);
    return value;
  }

  getAll() {
    return Array.from(this.map.values()).reverse();
  }

  set(id, item) {
    if (this.map.has(id)) {
      this.map.delete(id);
    } else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(id, item);
  }

  remove(id) {
    return this.map.delete(id);
  }
}

module.exports = { LruStore };
