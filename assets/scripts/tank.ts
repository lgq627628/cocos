const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // 子弹预设体
    @property(cc.Prefab)
    Bullet: cc.Prefab = null
    @property(cc.Node)
    firePos: cc.Node = null
    @property(cc.Node)
    boomNode: cc.Node = null

    // 输入轴
    v: number = 0;
    h: number = 0;
    // 坦克
    @property(cc.Node)
    tank: cc.Node = null
    body: cc.RigidBody = null
    speed: number = 300

    onLoad () {
      cc.director.getPhysicsManager().enabled = true
    }

    start () {
      this.addEvent()
      this.body = this.tank.getComponent(cc.RigidBody)
    }

    update (dt) {
      // 移动
      if (this.v !== 0) {
        this.body.linearVelocity = cc.v2(0, this.v * this.speed)
        this.tank.angle = this.v > 0 ? 0 : 180;
      } else if (this.h !== 0) {
        this.body.linearVelocity = cc.v2(this.h * this.speed, 0)
        this.tank.angle = this.h > 0 ? 270 : 90;
      } else {
        // 停止移动
        this.body.linearVelocity = cc.v2(0, 0)
        // if (!cc.audioEngine.isMusicPlaying()) {
        //   cc.audioEngine.playMusic(this.xxx, true)
        // }
      }
    }

    fire() {
      // cc.audioEngine.playEffect(this.xxx, false)
      // 创建子弹
      this.boom('blue')
      let bullet = cc.instantiate(this.Bullet)
      bullet.angle = this.tank.angle
      // 左边是绝对坐标位置，右边是相对位置
      let pos = this.firePos.convertToWorldSpaceAR(cc.v2(0, 0))
      bullet.x = pos.x
      bullet.y = pos.y
      bullet.setParent(cc.director.getScene())
    }

    boom(color) {
      let particle = this.boomNode.getComponent(cc.ParticleSystem)
      if (color) particle.startColor = particle.endColor = color
      particle.resetSystem()
    }

    addEvent() {
      // 按下
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, e => {
        if (e.keyCode === cc.macro.KEY.w) {
          this.v = 1
        } else if (e.keyCode === cc.macro.KEY.a) {
          this.h = -1
        } else if (e.keyCode === cc.macro.KEY.s) {
          this.v = -1
        } else if (e.keyCode === cc.macro.KEY.d) {
          this.h = 1
        }
        if (e.keyCode === cc.macro.KEY.l) {
          this.fire()
        }
      })
      // 抬起
      cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, e => {
        if (e.keyCode === cc.macro.KEY.w && this.v === 1) {
          this.v = 0
        } else if (e.keyCode === cc.macro.KEY.a && this.h === -1) {
          this.h = 0
        } else if (e.keyCode === cc.macro.KEY.s && this.v === -1) {
          this.v = 0
        } else if (e.keyCode === cc.macro.KEY.d && this.h === 1) {
          this.h = 0
        }
      })
    }
}
