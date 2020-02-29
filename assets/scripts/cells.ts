const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    cellPrefab: cc.Prefab = null
    @property(cc.Node)
    btn: cc.Node = null

    isPause: boolean = true
    cellArr: Array<any> = []
    timer: number = 0

    maxX: number = 0
    maxY: number = 0
    perW: number = 0
    perH: number = 0

    start () {
      this.initGrid()
      this.btn.on('touchstart', this.switchPause, this)
      this.node.on('touchstart', this.ontouchstart, this)
    }

    ontouchstart(e) {
      let pos = e.getLocation()
      pos = this.node.convertToNodeSpaceAR(pos)

      let i = ~~(pos.x / this.perW)
      let j = ~~(pos.y / this.perH)

      if (i < 0 || i > this.maxX || j < 0 || j > this.maxY) return
      this.cellArr[i][j].getComponent('cell').switchStatus()
    }

    switchPause() {
      this.isPause = !this.isPause
      this.btn.getComponentInChildren(cc.Label).string = this.isPause ? '开始' : '暂停'
    }

    initGrid() {
      let perW = 20
      let perH = 20
      let allH = cc.winSize.height
      let allW = cc.winSize.width - 300
      let maxX = allW / perW
      let maxY = allH / perH

      this.maxX = maxX
      this.maxY = maxY
      this.perW = perW
      this.perH = perH

      for (let i = 0; i < maxX; i++) {
        this.cellArr[i] = []
        for (let j = 0; j < maxY; j++) {
          let c = cc.instantiate(this.cellPrefab)
          c.x = i * perW
          c.y = j * perH
          this.node.addChild(c)
          this.cellArr[i][j] = c
        }
      }

    }

    update (dt) {
      if (this.isPause) return
      this.timer += dt
      if (this.timer > 0.1) {
        this.timer = 0
        this.calcAllStatus()
      }
    }

    calcAllStatus() {
      let nextStatusArr = [] // 存储下个要变化的状态

      this.cellArr.forEach((col, i) => {
        nextStatusArr[i] = []
        col.forEach((cell, j) => {
          let status = this.calcCellStatus(i, j) // 这边不能立即数数更改当前状态，否则会影响下一个方块的判断
          nextStatusArr[i][j] = status
        })
      })

      nextStatusArr.forEach((col, i) => {
        col.forEach((status, j) => {
          if (status === 1 || status === 0) this.cellArr[i][j].getComponent('cell').setStatus(status)
        })
      })
    }

    calcCellStatus(i, j) {
      let num = 0
      let grid = [
        {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1},
        {x: -1, y: 0}, {x: 1, y: 0},
        {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1}
      ]
      grid.forEach(g => {
        let x = i + g.x
        let y = j + g.y
        if (x < 0) x = this.maxX - 1
        if (y < 0) y = this.maxY - 1
        if (x >= this.maxX) x = 0
        if (y >= this.maxY) y = 0

        if (this.cellArr[x][y].getComponent('cell').status) num++
      })

      if (num === 3) {
        return 1
      } else if (num === 2) {
        return -1
      } else {
        return 0
      }
    }
}
