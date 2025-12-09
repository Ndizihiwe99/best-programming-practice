class Subject {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  async notify(data) {
    const promises = this.observers.map((observer) => observer.update(data));
    await Promise.all(promises);
  }
}

module.exports = Subject;
