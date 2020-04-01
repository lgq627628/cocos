const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    whiteBall: cc.Node = null;
    @property(cc.Node)
    cue: cc.Node = null;

    cueBody: cc.RigidBody = null

    start () {
      this.whiteBall.on(cc.Node.EventType.TOUCH_START, this._touchStart, this);
      this.whiteBall.on(cc.Node.EventType.TOUCH_MOVE, this._touchsMove, this);
      this.whiteBall.on(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
      this.whiteBall.on(cc.Node.EventType.TOUCH_CANCEL, this._touchEnd, this);
      this.cueBody = this.cue.getComponent(cc.RigidBody)
    }
    _touchStart() {}
    _touchsMove(e) {
      let startPos = this.whiteBall.getPosition()
      let endPos = this.node.convertToNodeSpaceAR(e.getLocation())
      let dir = endPos.sub(startPos)
      let l = dir.mag()
      if (l <= 30) {
        this.cue.active = false
        return
      }
      this.cue.active = true

      let r = Math.atan2(dir.y, dir.x)
      let angle = cc.misc.radiansToDegrees(r)
      angle = angle - 90
      this.cue.angle = angle + 180

      this.cue.x = endPos.x + this.cue.height / 2 * dir.x / l
      this.cue.y = endPos.y + this.cue.height / 2 * dir.y / l

    }
    _touchEnd() {
      if (!this.cue.active) return
      this.shootAt(this.whiteBall.getPosition())
    }

    shootAt(pos) {
      // 给这个球杆一个冲量：方向和大小
      let src = this.cue.getPosition()
      let dir = pos.sub(src)
      let l = dir.mag()
      let dis = l - this.cue.height / 2
      let ratio = 50

      let x = dis * dir.x / l * ratio
      let y = dis * dir.y / l * ratio

      // this.cueBody.applyLinearImpulse(冲量大小向量, 质心世界坐标, true) // 是否立马唤醒
      this.cueBody.applyLinearImpulse(cc.v2(x, y), this.cue.convertToWorldSpaceAR(cc.v2(0, 0)), true)
    }

    update (dt) {}
}
