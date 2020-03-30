const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;
    @property(cc.Node)
    daodan: cc.Node = null;

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, e => {
          console.log('clcik')
          let pos = e.getLocation()
          pos = this.node.getChildByName('bg').convertToNodeSpaceAR(pos)
          this.target.position = pos
          this.moveDaodan()
        }, this)
        this.moveDaodan()
    }

    moveDaodan() {
      this.daodan.stopAllActions()
      let angle = this.getAngle(this.daodan, this.target)
      cc.tween(this.daodan)
        .to(0.1, {angle})
        .to(1, { position: this.target.position })
        .start()
    }

    getAngle(node1, node2) {
        let r = Math.atan2(node2.y - node1.y, node2.x - node1.x)
        let angle = cc.misc.radiansToDegrees(r)
        return angle
    }

    update (dt) {}
}
