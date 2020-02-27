const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    startPos: cc.Vec2 = null

    init (texture, pos) {
      let sprite = this.node.getComponent(cc.Sprite)
      let w = this.node.width
      let h = this.node.height
      let frame = new cc.SpriteFrame(texture, cc.rect(pos.x * w, pos.y * h, w, h))
      sprite.spriteFrame = frame
    }

    onLoad() {
      this.node.on('touchstart', this.touchstart, this)
      this.node.on('touchmove', this.touchmove, this)
      this.node.on('touchend', this.touchend, this)
    }

    touchstart() {
      this.node.opacity = 120
      this.startPos = this.node.position
      this.node.zIndex = 1
    }

    touchmove(e) {
      let delta = e.getDelta()
      this.node.x += delta.x
      this.node.y += delta.y
    }

    touchend() {
      this.node.opacity = 255
      this.node.zIndex = 0
      this.checkPutPos()
    }

    checkPutPos() {
      let w = this.node.width
      let h = this.node.height
      let {i, j} = this.getPosIdx(this.node)


      let tempPic = window.puzzle.puzzleArr[i][j]
      if (tempPic) {
        this.node.setPosition(j * w, - i * h)
        tempPic.setPosition(this.startPos)

        let idx = this.getPosIdx(tempPic)

        console.log(idx.i, idx.j, '---', i, j)

        window.puzzle.puzzleArr[i][j] = this.node
        window.puzzle.puzzleArr[idx.i][idx.j] = tempPic
      } else {
        this.node.setPosition(this.startPos)
      }
    }

    getPosIdx(node) {
      let w = this.node.width
      let h = this.node.height
      console.log(w, h)
      let i = Math.abs(parseInt((node.y - h / 2) / h))
      let j = Math.abs(parseInt((node.x + w / 2) / w))
      return {i, j}
    }
}
