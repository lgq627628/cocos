const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

  @property(cc.SpriteAtlas)
  colorArr: cc.SpriteAtlas = null
  startPos: cc.Vec2 = null
  canMove: boolean = true


  onLoad() {
    this.node.on('touchstart', this.onTouchStart, this)
    this.node.on('touchmove', this.onTouchMove, this)
    this.node.on('touchend', this.onTouchEnd, this)
  }

  onTouchStart(e) {
    // if (this.node.blockIdx > 0) return;
    this.canMove = true
    this.startPos = this.node.position
    let nowBlockArr = window.hannuota.blockNodeArr[this.node.baseIdx]
    if (this.node.blockIdx !== nowBlockArr[nowBlockArr.length - 1].blockIdx) this.canMove = false
  }

  onTouchMove(e) {
    if (!this.canMove) return;
    let delta = e.getDelta()
    this.node.x += delta.x
    this.node.y += delta.y
  }

  onTouchEnd() {
    if (!this.canMove) return;
    window.hannuota.getBlockIdx(this.node, this.startPos)
  }

  onDestroy() {
    this.node.off('touchstart', this.onTouchStart, this)
    this.node.off('touchmove', this.onTouchMove, this)
    this.node.off('touchend', this.onTouchEnd, this)
  }

  init(idx) {
    this.node.getComponent(cc.Sprite).spriteFrame = this.colorArr.getSpriteFrame(idx)
    this.node.width = 80 + idx * 40
  }
}
