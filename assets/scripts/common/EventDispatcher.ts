import EventComponent from "./EventComponent"
import { EventBase } from "./EventBase"

/**
 * 事件分发器
 * 双方不知道对方是谁
 * 单例模式
 */
export default class EventDispatcher {
  private static _instace: EventDispatcher = null
  componentArr: EventComponent[] = []

  static getInstance() {
    if(!EventDispatcher._instace) EventDispatcher._instace = new EventDispatcher()
    return EventDispatcher._instace
  }

  registComponent(component: EventComponent) {
    this.componentArr.push(component)
  }

  removeComponent(component: EventComponent) {
    let idx = this.componentArr.indexOf(component)
    if (idx >= 0) this.componentArr.splice(idx, 1)
  }

  dispatchEvent(eventBase: EventBase) {
    for (let i = 0; i < this.componentArr.length; i++) {
      let c = this.componentArr[i]
      if (c.receiveEvent(eventBase)) break
    }
  }
}
