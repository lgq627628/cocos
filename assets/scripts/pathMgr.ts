const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.Prefab)
    wuqiPrefab: cc.Node = null;

    isPause: boolean = false

    onLoad () {
      this.addEvent()
      window.G_CTRL = this
    }

    addEvent() {
      this.node.on(cc.Node.EventType.TOUCH_START, e => {
        let pos = e.getLocation()
        let distance = this.node.convertToNodeSpaceAR(pos)
        this.player.getComponent('navAgent').walkTo(distance)
      }, this)

      cc.systemEvent.on('keydown', this.onKeyDown, this)
    }
    onKeyDown() {
      // 关于暂停
      // 屏蔽玩家操作，在顶层加个弹窗即可
      // 你游戏应该有一个主update就够了，所有的操作都在这个update里执行
      // 从canvas节点递归迭代子节点, 调用 node.pauseAllActions()
      // 此时, 所有的内容都暂停, 但是后面新创建的内容不受影响
      // 恢复运行也是递归迭代canvas的子节点, 调用 node.resumeAllActions()
      this.isPause ? cc.director.resume() : cc.director.pause()
      // this.isPause ? cc.director.resume() : Game.pause()
      this.isPause = !this.isPause
    }

    shootWuqi(start, end) {
      let wuqi = cc.instantiate(this.wuqiPrefab)
      wuqi.getComponent('wuqi').init(start, end, this.node)
    }

    update (dt) {}
}
