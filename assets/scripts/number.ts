const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    numHeight: number = 0
    speed: number = 300
    nowNum: number = 0
    onLoad () {
      this.numHeight = this.content.height / this.content.children.length
      // this.setNum(5)
      // this.scrollToNum(0)
      this.setNum(0)
      this.scrollToNum(5)
    }

    setNum(num) {
      this.nowNum = num
      this.content.y = this.numHeight / 2 + num * this.numHeight
    }

    scrollToNum(num) {
      if (this.nowNum > num) num += 10
      let dis = (num - this.nowNum) * this.numHeight
      cc.tween(this.content)
        .by(dis/this.speed, {y: dis}, {easing: 'elasticOut'})
        .call(() => {
          this.setNum(num)
          // this.scrollToNum(4)
        })
        .start()
    }

    update (dt) {}
}
