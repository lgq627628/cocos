const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_CTRL extends cc.Component {

    view: object = null

    onLoad () {
      this.view = {} // 路径和节点的映射
      this.loadAllObject(this.node, '')
      console.log(this.view)
    }
    loadAllObject(root, path) {
      for(let i = 0; i < root.childrenCount; i++) {
        let nowChild = root.children[i]
        let nowPath = path + nowChild.name
        this.view[nowPath] = nowChild
        this.loadAllObject(nowChild, nowPath + '/')
      }
    }

}
