const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    speed: number = 400

    moveTime: number = 0
    passTime: number = 0
    vx: number = 0
    vy: number = 0
    startWalk: boolean = false

    walkTo(distance) {
      let start = this.node.getPosition()
      let dir = distance.sub(start)
      let l = dir.mag()
      if (l <= 0 ) return

      this.moveTime = l / this.speed
      this.passTime = 0
      this.vx = this.speed * dir.x / l
      this.vy = this.speed * dir.y / l
      this.startWalk = true
    }

    stopWalk() {
      this.startWalk = false
    }

    update (dt) {
      if (!this.startWalk) return
      this.passTime += dt
      if (this.passTime > this.moveTime) { // 可能最后一段时间会跃迁
        dt -= (this.passTime - this.moveTime)
      }
      this.node.x += this.vx * dt
      this.node.y += this.vy * dt

      if (this.passTime > this.moveTime) {
        this.startWalk = false
      }
    }
}
