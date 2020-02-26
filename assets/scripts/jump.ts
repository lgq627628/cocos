const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    ball: cc.Node = null
    @property(cc.Prefab)
    pingbanPrefab: cc.Prefab = null
    pingbanArr: Array<cc.Node> = []
    isStart: Boolean = false
    ballSpeedX: number = -300
    distance: number = 150

    onLoad() {
      cc.director.getPhysicsManager().enabled = true
      // cc.director.getPhysicsManager().debugDrawFlags = 1
      cc.director.getPhysicsManager().gravity = cc.v2(0, -2100)
    }

    start () {
      this.node.on('touchstart', this.boost, this)
      this.initPingban()
    }

    initPingban() {
      for (let i = 0; i < 5; i++ ) {
        let pingban = cc.instantiate(this.pingbanPrefab)
        pingban.x = this.ball.x + i * this.distance
        pingban.y = 0
        this.node.addChild(pingban)
        this.pingbanArr.push(pingban)
      }
    }

    boost() {
      if (this.ball.getComponent('ball').originVY) {
        let rigidBody = this.ball.getComponent(cc.RigidBody)
        rigidBody.linearVelocity = cc.v2(0, -1200)
        this.isStart = true
      }
    }

    onDestroy() {
      this.node.off('touchstart', this.boost, this)
    }

    getLastPingbanPosX() {
      let posX = this.pingbanArr[0].x
      for (let pingban of this.pingbanArr) {
        if (pingban.x > posX) {
          posX = pingban.x
        }
      }
      return posX
    }

    update (dt) {
      if (this.isStart) {
        for (let pingban of this.pingbanArr) {
          pingban.x += this.ballSpeedX * dt
          if (pingban.x < -cc.winSize.width / 2 - pingban.width / 2) {
            pingban.x = this.getLastPingbanPosX() + this.distance
            // 随机设置宽度，最好直接给 pingban 写个单独脚本，然后调用方法
            pingban.width = Math.random() * 70 + 40
            pingban.getComponent(cc.PhysicsBoxCollider).size.width = pingban.width // 改变大小的同时也要改变碰撞形状大小
          }
        }
        if (this.ball.y < -cc.winSize.height / 2) {
          this.isStart = false
          alert('失败了吧')
          cc.director.loadScene('jump')
        }
      }
    }
}
