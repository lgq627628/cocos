// 这个人物层级和血条应该在同一层级，不然缩放血条也会一起缩放
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    INITIAL_BLOOD: number = 1
    bloodVal: number = 1
    isHitNow: boolean = false

    onLoad() {
      this.bloodVal = this.INITIAL_BLOOD
      this.node.getChildByName('bloodBar').getChildByName('blood').getComponent(cc.Sprite).fillRange = this.bloodVal
    }

    onCollisionEnter (other, self) {
      this.bloodVal -= 0.001
      if (this.bloodVal <= 0) {
        this.bloodVal = 0
      }
      if (!this.isHitNow) {
        this.isHitNow = true
        cc.tween(this.node)
          .to(0.08, { scale: 0.8 })
          .to(0.06, { scale: 1.1 })
          .call(() => {
            this.node.scale = 1
            this.isHitNow = false
          })
          .start()
      }
      this.node.getChildByName('bloodBar').getChildByName('blood').getComponent(cc.Sprite).fillRange = this.bloodVal
      console.log('xxxxx')
    }

}
