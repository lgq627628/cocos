import { UI_MGR } from './common/UI_MGR'

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // 所有整体逻辑都放在这里，各层 UI 写在各层 UI 里面
    onLoad () {
      this.gotoLoginUI()
    }

    gotoLoginUI() {
      // 释放资源，如果有
      // 生成地图数据，如果有
      // new ui 界面，如果有
      UI_MGR.showUIAt(this.node, 'LoginUI')
    }
    update (dt) {}
}
