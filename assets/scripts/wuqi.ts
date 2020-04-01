const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    speed: number = 200

    onLoad () {}

    init(start, end, parent) {
      // 要传入世界坐标
      let dir = end.sub(start)
      let l = dir.mag()
      let relativeStart = parent.convertToNodeSpaceAR(start)
      let relativeEnd = parent.convertToNodeSpaceAR(end)


      // 已知向量转角度
      let r = Math.atan2(dir.y, dir.x)
      let angle =cc.misc.radiansToDegrees(r)
      angle = angle - 90
      this.node.angle = angle

      this.node.parent = parent
      this.node.position = relativeStart
      cc.tween(this.node)
        .to(l/this.speed, {position: relativeEnd})
        .call(() => {
          this.node && this.node.destroy()
          // this.node.removeFromParent(parent)
        })
        .start()
    }

    onCollisionEnter (other, self) {
      this.node && this.node.destroy()
    }

    update (dt) {}
}
