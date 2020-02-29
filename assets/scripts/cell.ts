const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    inner: cc.Node = null
    status: number = 0

    // 每个方块的点击事件不能直接加在预设里面，否则很占内存
    switchStatus() {
      if (this.status) {
        this.status = 0
        this.inner.color = cc.color(255, 255, 255, 255)
      } else {
        this.status = 1
        this.inner.color = cc.color(0, 0, 0, 255)
      }
    }

    setStatus(status) {
      this.status = status
      this.inner.color = status === 0 ? cc.color(255, 255, 255, 255) : cc.color(0, 0, 0, 255)
    }
}
