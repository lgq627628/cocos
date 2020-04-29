const {ccclass, property} = cc._decorator;

@ccclass
export default class Grid extends cc.Component {

    onLoad () {}

    setColor(gridType: GridType) {
      switch (gridType) {
        case GridType.Normal:
          this.node.color = new cc.Color(255, 255, 255, 255)
          break;
        case GridType.Wall:
          this.node.color = new cc.Color(0, 0, 0, 255)
          break;
        case GridType.Start:
          this.node.color = new cc.Color(0, 255, 0, 255)
          break;
        case GridType.End:
          this.node.color = new cc.Color(255, 0, 0, 255)
          break;
        case GridType.Road:
          this.node.color = new cc.Color(255, 255, 0, 255)
        break;
      }
      this.node.color
    }

    update (dt) {}
}


export class GridData {
  type: GridType
  i: number
  j: number
  isVisited: boolean = false
}

export enum GridType {
  Normal,
  Wall,
  Start,
  End,
  Road
}
