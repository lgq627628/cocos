import { GridData, GridType } from "./Grid";
import Grid from "./Grid";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    gridPrefab: cc.Prefab = null;
    @property(cc.Node)
    xx: cc.Node = null;

    hh: any = null

    GRID_NUM_X: number = 8
    GRID_NUM_Y: number = 8

    gridNodeArr: Grid[][] = []
    gridDataArr: GridData[][] = []

    GRID_SIZE: number = 50

    startGrid: GridData
    endGrid: GridData

    finalPathArr: GridData[] = []

    onLoad () {
      this.createGridPanel()
      this.addTouchEvent()
      this.playRotate()
    }

    playRotate() {
      if (this.hh) {
        this.hh.start()
        return
      }
      let hh = cc.tween(this.xx)
        .by(3, { angle: this.xx.angle + 360 })
        .repeatForever()
        .start()
      this.hh = hh
      console.log(hh)
    }

    stopRotate() {
      this.hh.stop()
      // this.xx.stopAllActions()
      // console.log(this.xx)
    }

    restart() {
      this.stopRotate()
      this.startGrid = null
      this.endGrid = null
      this.gridNodeArr.forEach(arr => {
        arr.forEach(g => g.node.removeFromParent())
      })
      this.gridNodeArr = []
      this.gridDataArr = []
      this.finalPathArr = []
      this.createGridPanel()
    }

    createGridPanel() {
      for(let i = 0; i < this.GRID_NUM_X; i++) {
        this.gridNodeArr[i] = []
        this.gridDataArr[i] = []
        for(let j = 0; j < this.GRID_NUM_Y; j++) {
          let grid = cc.instantiate(this.gridPrefab).getComponent(Grid)
          this.node.addChild(grid.node)
          grid.node.x = this.GRID_SIZE * (i - this.GRID_NUM_X/2)
          grid.node.y = this.GRID_SIZE * (j - this.GRID_NUM_Y/2)
          let gridData = new GridData()
          gridData.i = i
          gridData.j = j
          gridData.type = Math.random() < 0.3 ? GridType.Wall : GridType.Normal
          grid.setColor(gridData.type)
          this.gridDataArr[i][j] = gridData
          this.gridNodeArr[i][j] = grid
        }
      }
    }

    addTouchEvent() {
      this.node.on(cc.Node.EventType.TOUCH_START, this.addStartEndGrid, this)
    }

    addStartEndGrid(e) {
      let pos = this.node.convertToNodeSpaceAR(e.getLocation())
      let i = Math.round(pos.x / this.GRID_SIZE) + this.GRID_NUM_X / 2
      let j = Math.round(pos.y / this.GRID_SIZE) + this.GRID_NUM_Y / 2
      if (i < 0 || j < 0 || i > this.GRID_NUM_X - 1 || j > this.GRID_NUM_Y - 1) return
      if (!this.startGrid) {
        this.startGrid = this.gridDataArr[i][j]
        this.startGrid.type = GridType.Start
        this.gridNodeArr[i][j].setColor(this.startGrid.type)
      } else if (!this.endGrid) {
        this.endGrid = this.gridDataArr[i][j]
        this.endGrid.type = GridType.End
        this.gridNodeArr[i][j].setColor(this.endGrid.type)
        this.findPath(this.startGrid)
        this.checkFinalPath()
      }
    }


    findPath(nowGrid: GridData) {
      if (nowGrid === this.endGrid) return
      let roundGridArr = this.findRoundGrid(nowGrid)

      // this.sortGrid(roundGridArr)
      // for(let i = 0; i < roundGridArr.length; i++) {
      //   let grid = roundGridArr[i]
      // }

      let bestGrid = this.findBestGrid(roundGridArr)
      if (!bestGrid) return
      bestGrid.isVisited = true
      this.finalPathArr.push(bestGrid)
      if (bestGrid === this.endGrid) return
      this.findPath(bestGrid)
    }

    checkFinalPath() {
      console.log(this.finalPathArr)
      let lastGrid = this.finalPathArr[this.finalPathArr.length - 1]
      if (lastGrid === this.endGrid) {
        this.drawFinalPath()
      } else {
        console.log('无解')
      }
    }

    drawFinalPath() {
      this.finalPathArr.pop()
      this.finalPathArr.forEach(grid => {
        grid.type = GridType.Road
        this.gridNodeArr[grid.i][grid.j].setColor(grid.type)
      })
    }

    findRoundGrid(gridData: GridData) {
      let roundGridArr = []
      let dirArr = [
        {x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1},
        {x: 0, y: -1}, {x: 0, y: 1},
        {x: 1, y: -1}, {x: 1, y: 0}, {x: 1, y: 1}
      ]
      let midX = gridData.i
      let midY = gridData.j
      dirArr.forEach(dir => {
        let i = dir.x + midX
        let j = dir.y + midY
        if (i < 0 || i > this.GRID_NUM_X - 1 || j < 0 || j > this.GRID_NUM_Y - 1) return
        let nowGrid = this.gridDataArr[i][j]
        if ((nowGrid.type === GridType.Normal || nowGrid.type === GridType.End) && !nowGrid.isVisited) roundGridArr.push(nowGrid)
      })

      return roundGridArr
    }

    findBestGrid(roundGridArr: GridData[]) {
      let {i, j} = this.endGrid
      roundGridArr.sort((gridOne, gridTwo) => {
        let disOne = this.calcDistance(gridOne, this.endGrid)
        let disTwo = this.calcDistance(gridTwo, this.endGrid)
        // let disOne2 = this.calcDistance(gridOne, this.startGrid)
        // let disTwo2 = this.calcDistance(gridTwo, this.startGrid)
        let disOne2 = 0
        let disTwo2 = 0
        return (disOne + disOne2) > (disTwo + disTwo2) ? 1 : -1
      })
      return roundGridArr[0]
    }

    sortGrid(roundGridArr: GridData[]) {
      let {i, j} = this.endGrid
      roundGridArr.sort((gridOne, gridTwo) => {
        let disOne = this.calcDistance(gridOne, this.endGrid)
        let disTwo = this.calcDistance(gridTwo, this.endGrid)
        // let disOne2 = this.calcDistance(gridOne, this.startGrid)
        // let disTwo2 = this.calcDistance(gridTwo, this.startGrid)
        let disOne2 = 0
        let disTwo2 = 0
        return (disOne + disOne2) > (disTwo + disTwo2) ? 1 : -1
      })
      return roundGridArr
    }

    calcDistance(pos1: GridData, pos2: GridData) {
      return Math.abs(pos1.i - pos2.i) + Math.abs(pos1.j - pos2.j)
    }

    update (dt) {}
}
