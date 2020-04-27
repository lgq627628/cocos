// import EventComponent from "./common/EventComponent";
import EventDispatcher from "./common/EventDispatcher";
import { EventType, EventCreateTower, TowerType } from "./common/EventBase";
import EventListener from "./common/EventListener";

const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
// @requireComponent(EventComponent) // 这个说明 EventComponent 和 Actor 是强相关的，Actor 必须依赖 EventComponent
export default class Actor extends EventListener {


  onLoad() {
    this.eventComponent.registEvent(EventType.CreateTower, this.onEventCreateTower)
  }

  onEventCreateTower(eventType: EventCreateTower): boolean {
    let towerType = eventType.towerType
    if (towerType === TowerType.TowerOne) {
      // todo
    }
    return false
  }

  // 如何从其他地方触发，下面这些是写在其他地方
  // let e = new EventCreateTower()
  // e.towerType = TowerType.TowerOne
  // e.towerPos = this.node.position
  // EventDispatcher.getInstance().dispatchEvent(e)
}
