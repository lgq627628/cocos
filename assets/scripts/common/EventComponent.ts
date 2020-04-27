import { EventType, EventBase } from "./EventBase";
import EventDispatcher from "./EventDispatcher";
import EventListener from "./EventListener";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EventComponent extends cc.Component {
  private eventMap: Map<EventType, (eventBase: EventBase) => boolean> = new Map<EventType, (eventBase: EventBase) => boolean>()
  target: EventListener = null

  onLoad() {
    this.target = this.getComponent(EventListener)
    EventDispatcher.getInstance().registComponent(this)
  }
  /**
   * 添加事件监听
   * @param eventType
   * @param cb
   */
  registEvent(eventType: EventType, cb: (eventBase: EventBase) => boolean) {
    this.eventMap.set(eventType, cb)
  }
  /**
   * 接收事件并触发相应函数
   * @param eventBase
   */
  receiveEvent(eventBase: EventBase): boolean {
    // 为什么要返回布尔值，因为一个游戏可能很多人多监听了这个事件，也就是监听者有很多，到时候不用一个一个遍历去执行，事件传递到此就结束了，返回为 true 表示已经触发过了，基于性能的考虑
    if (this.eventMap.has(eventBase.eventType)) {
      return this.eventMap.get(eventBase.eventType).call(this.target, eventBase)
    }
    return false
  }
}
