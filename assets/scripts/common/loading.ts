const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {



    onLoad () {
      // 常驻根节点
      cc.game.addPersistRootNode(this.node)
    }



    showLoading() {

    }

    hideLoading() {

    }

    update (dt) {}
}
