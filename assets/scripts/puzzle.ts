const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Prefab)
    perPuzzle: cc.Prefab = null
    @property(cc.Node)
    box: cc.Node = null
    picTexture: any = null
    puzzleArr: Array<any> = []

    onLoad () {
      window.puzzle = this
      cc.loader.loadRes('girl.png', (err, texture) => {
        this.picTexture = texture

        for(let i = 0; i < 4; i++) {
          this.puzzleArr[i] = []
          for(let j = 0; j < 4; j++) {
            let p = cc.instantiate(this.perPuzzle)
            p.getComponent('perPuzzle').init(texture, cc.v2(j, i))
            p.x = j * 180
            p.y = - i * 180
            this.box.addChild(p)
            this.puzzleArr[i][j] = p
          }
        }

        this.randomPuzzle()
      })
    }

    randomPuzzle() {
      for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
          let randomX = ~~(Math.random() * 4)
          let randomY = ~~(Math.random() * 4)
          let now = this.puzzleArr[i][j]
          let next =  this.puzzleArr[randomX][randomY]
          let nowPos = now.position
          let nextPos = next.position

          now.position = nextPos
          next.position = nowPos

          this.puzzleArr[i][j] = next
          this.puzzleArr[randomX][randomY] = now

        }
      }
    }
}
