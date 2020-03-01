const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // 这是摄像机跟随组件
    @property(cc.Node)
    target: cc.Node = null;

    update (dt) {
      let pos = this.target.convertToWorldSpaceAR(cc.v2(0, 0))
      let relativePos = this.node.parent.convertToNodeSpaceAR(pos)
      this.node.x = relativePos.x
    }
}
