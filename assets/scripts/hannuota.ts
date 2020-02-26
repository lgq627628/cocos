const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    box: cc.Node = null;
    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null;
    @property([cc.Node])
    baseArr: Array<cc.Node> = []
    blockNodeArr: Array<any> = [[], [], []]
    blockNum: number = 4

    onLoad () {
        window.hannuota = this
        this.initBlock(this.blockNum)
    }

    initBlock(num) {
        for(let i = 0; i < num; i++) {
            let blockNode = cc.instantiate(this.blockPrefab)
            blockNode.x = this.baseArr[0].x
            blockNode.y = -122 + i * 44
            blockNode.baseIdx = 0;
            blockNode.blockIdx = num - 1 - i;
            blockNode.getComponent('block').init(num - 1 - i)
            this.box.addChild(blockNode)
            this.blockNodeArr[0].push(blockNode)
        }
    }

    getBlockIdx(node, startPos) {
      let pos = node.position
      let idx = this.baseArr.findIndex((base, i) => {
        return (pos.x > base.x - base.width / 2 && pos.x <= base.x + base.width / 2)
      })
      if (idx < 0 || idx === node.baseIdx) {
        node.position = startPos
        return
      }
      let targetArr = this.blockNodeArr[idx]
      if (targetArr.length && targetArr[targetArr.length - 1].blockIdx <= node.blockIdx) {
        node.position = startPos
        return
      }

      let base = this.baseArr[idx]
      node.x = base.x
      this.blockNodeArr[node.baseIdx].pop()
      node.y = -122 + 44 * targetArr.length
      node.baseIdx = idx
      targetArr.push(node)
      if (targetArr.length === this.blockNum) {
        setTimeout(() => {
          alert('成功啦')
        }, 50)
      }
    }
}
