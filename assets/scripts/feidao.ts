const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    knife: cc.Node = null
    @property(cc.Node)
    target: cc.Node = null
    @property(cc.Prefab)
    knifePrefab = null

    targetSpeed: number = 5
    knifeArr: Array<cc.Node> = []
    isMoving = false

    start () {
      this.target.zIndex = 1
      this.node.on('touchstart', this.throwKnife, this)
      setInterval(() => {
        this.targetSpeed = ~~(Math.random() * 10) - 5 || 1
      }, 3000)
    }

    throwKnife() {
      if (this.isMoving) return
      this.isMoving = true
      let pos = cc.v2(this.knife.x, this.target.y - this.target.height / 2)
      cc.tween(this.knife)
        .to(0.1, { position: pos })
        .call(() => {
          cc.tween(this.target)
            .to(.1, {scale: 1.15})
            .to(.1, {scale: .9})
            .to(.1, {scale: 1})
            .start()
          if (!this.checkPos()) {
            let knife = cc.instantiate(this.knifePrefab)
            knife.position = pos
            this.node.addChild(knife)
            this.knifeArr.push(knife)
            this.knife.y = -300
            this.isMoving = false
          } else {
            cc.tween(this.knife)
            .to(0.1, { position: cc.v2(cc.winSize.width / 2 * Math.random(), - cc.winSize.height / 2), angle: Math.random() * 30 })
            .call(() => {
              cc.director.loadScene('feidao')
            })
            .start()
          }
        })
        .start()
    }

    checkPos() {
      // 方法一：可以判断每个小刀的角度是否朝上
      // 方法二：可以判断每个小刀的中心和现在飞刀的中心在一定范围内
      let err = 30
      let x = this.knife.x
      let y = this.knife.y
      let idx = this.knifeArr.findIndex(knife => {
        let diffX = knife.x - x
        let diffY = knife.y - y
        return diffX * diffX + diffY * diffY < err * err
      })
      return idx >= 0
    }

    update (dt) {
      this.target.angle = (this.target.angle + this.targetSpeed) % 360
      this.knifeArr.forEach(knife => {
        knife.angle = (knife.angle + this.targetSpeed) % 360 // 相对于自身旋转几度，而不是圆盘转几度，飞刀也转几度

        let radian = (knife.angle - 90) * 2 * Math.PI / 360
        let r = this.target.height / 2
        knife.x = this.target.x + r * Math.cos(radian)
        knife.y = this.target.y + r * Math.sin(radian)
      })
    }
}
