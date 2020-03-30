const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;

    roadData: any = []
    nextStep: number = 0
    speed: number = 100

    start () {
      this.roadData = this.bg.getComponent('genPath').get_road_set()[1]
      this.walk()
      console.log('sss', this.roadData)
    }

    walk() {
      if (this.roadData.length < 2) return
      this.node.setPosition(this.roadData[this.nextStep])
      this.nextStep++
      this.walkToNext()
    }

    walkToNext() {
      if (this.nextStep >= this.roadData.length) return
      let start = this.node.getPosition()
      let end = this.roadData[this.nextStep]
      let len = end.sub(start).mag()

      if (len <= 0) return
      let moveTime = len / this.speed
      cc.tween(this.node)
        .to(moveTime, { position: end })
        .call(() => {
          this.nextStep++
          this.walkToNext()
        })
        .start()
    }

    update (dt) {}
}
