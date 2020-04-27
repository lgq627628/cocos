import EventComponent from "./EventComponent";

const {ccclass, requireComponent} = cc._decorator;

@ccclass
@requireComponent(EventComponent) // 这个说明 EventComponent 和 Actor 是强相关的，Actor 必须依赖 EventComponent
export default class EventListener extends cc.Component {
  eventComponent: EventComponent = null
  onLoad() {
    this.eventComponent = this.getComponent(EventComponent)
  }
}
