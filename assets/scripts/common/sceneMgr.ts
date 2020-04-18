const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    @property(cc.Node)
    loading: cc.Node = null

    curSceneName: string = ''
    onLoad () {}

    loadScene(sceneName) {
      this.loading.getComponent('loading').showLoading()
      this.curSceneName = sceneName
      cc.director.preloadScene(sceneName, this.onSceneLoaded)
    }

    onSceneLoaded() {
      this.loading.getComponent('loading').hideLoading()
      cc.director.loadScene(this.curSceneName)
    }

    update (dt) {}
}
