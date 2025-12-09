class Observer {
  async update(data) {
    throw new Error("update() must be implemented");
  }
}

module.exports = Observer;
