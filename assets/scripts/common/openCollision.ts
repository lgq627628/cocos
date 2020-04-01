const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    isDebug: Boolean = false

    start () {
      let manager = cc.director.getCollisionManager()
      manager.enabled = true
      if (this.isDebug) manager.enabledDebugDraw = true
    }
}
