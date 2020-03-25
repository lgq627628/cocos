const {ccclass, property} = cc._decorator;

@ccclass
export default class Level extends cc.Component {

    @property(cc.Node)
    wrap: cc.Node = null;
    @property(cc.Prefab)
    knifePrefab: cc.Prefab = null;

    centerPos: cc.Vec2 = null
    onLoad () {
        this.centerPos = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2)
        this.wrap.children.forEach((item, idx) => {
            for (let i=0; i < 5; i++) {
                let knife = cc.instantiate(this.knifePrefab)
                knife.parent = item
                knife.scale = 0.4
                knife.x = 0
                knife.y = 0

                let rad = 2 * Math.PI / 8
                let dir = cc.v2(1, 0).rotate(i * rad)
                let pos = dir.mul(80) // 单位向量乘以倍数
                knife.position = pos
                knife.angle = cc.misc.radiansToDegrees(i * rad) - 90
                // knife.angle = -cc.misc.radiansToDegrees(dir.signAngle(cc.v2(0, 1))) // 这是求两个向量的弧度
            }
            UI_MGR.addBtnEvent(item, function() {
              console.log('xxx', idx)
            }, this)
        })
    }

    update (dt) {
      this.wrap.children.forEach(item => {
        let pos = item.convertToWorldSpaceAR(cc.v2(0, 0))
        let len = cc.winSize.width / 2 - Math.abs(this.centerPos.x - pos.x)
        let scale = len / cc.winSize.width
        if (scale < 0.1) scale = 0.1
        if (scale > 0.5) scale = 0.5
        item.children.forEach(node => {
          if (node.name === 'knife') {
            node.scaleY = scale
          }
        })
      })
    }
}
