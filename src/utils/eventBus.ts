interface ICallback {
  eventName: string
  callbacks: (() => void)[]
}

class EventEmitter {
  callbacks: ICallback[]
  constructor() {
    this.callbacks = []
  }
  addListener(eventName: string, fn: () => void) {
    if (!this.callbacks.length) {
      this.callbacks = [
        {
          eventName,
          callbacks: [fn],
        },
      ]
    }
    let flag = false
    this.callbacks.forEach((item) => {
      if (item.eventName === eventName) {
        flag = true
        item.callbacks.push(fn)
      }
    })
    if (!flag) {
      this.callbacks.push({
        eventName,
        callbacks: [fn],
      })
    }
  }
  removeListener(eventName: string, fn: () => void) {
    this.callbacks.forEach((item) => {
      if (item.eventName === eventName) {
        item.callbacks = item.callbacks.filter((item) => item !== fn)
      }
    })
  }
  emit(eventName: string) {
    this.callbacks.forEach((item) => {
      if (item.eventName === eventName) {
        item.callbacks.forEach((fn) => fn())
      }
    })
  }
}

export default new EventEmitter()
