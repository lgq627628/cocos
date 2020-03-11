const {ccclass, property} = cc._decorator;

@ccclass
export default class Bubble extends cc.Component {

    @property([cc.SpriteFrame]) bubbleSpriteFrame: cc.SpriteFrame[] = [];
    isVisited: boolean = false
    isSameColor: boolean = false
    isLinked: boolean = false
    color: number = 0

    init(parent: cc.Node, pos: cc.Vec2, color: number = 0) {
      this.color = color
      parent.addChild(this.node)
      this.node.position = pos
      this.setSpriteFrame(this.bubbleSpriteFrame[color] || this.bubbleSpriteFrame[0])
    }

    setSpriteFrame(spriteFrame) {
      this.getComponent(cc.Sprite).spriteFrame = spriteFrame
    }

    playDieAnim() {
      return new Promise((resolve) => {
        cc.tween(this.node)
        .to(.1, { scale: 1.2 })
        .to(.05, { scale: 0.9 })
        .call(() => {
          this.node.parent = null
          resolve()
        })
        .start()
      })
    }

    playDropAnim() {
      let y = this.node.y - 400
      cc.tween(this.node)
        .to(.3, { y, opacity: 0 })
        .call(() => {
          this.node.parent = null
        })
        .start()
    }
}
