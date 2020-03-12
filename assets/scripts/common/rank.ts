const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

  @property(cc.Node)
  rankLayer: cc.Node = null

  subContextView: cc.WXSubContextView = null

  start() {
    this.subContextView = this.rankLayer.getComponent(cc.WXSubContextView)
    this.subContextView.enabled = false // 禁止频繁刷新，不然它会每帧渲染，没必要
    this.rankLayer.active = false
  }

  showRanking() {
    console.log('显示排行榜')
    // 获取跟新时间搓
    let time = ~~(new Date().getTime() / 1000)
    // 获取排行榜上对应的信息
    let getModuleNameArr = []
    getModuleNameArr.push('score')

    let openDataContext = wx.getOpenDataContext()
    openDataContext.postMessage({
      type: 'GET',
      data: getModuleNameArr,
      timer: time
    })
    this.subContextView.enabled = true
    this.rankLayer.active = true
    this.subContextView.update() // 手动更新避免频繁刷新
    console.log('已经向子域发送GET信息')
  }

  hideRanking() {
    console.log('隐藏排行榜')
    this.subContextView.enabled = false // 禁止频繁刷新，不然它会每帧渲染，没必要
    this.rankLayer.active = false
  }

  refreshRanking() {
    console.log('给开放数据域发送信息')
    let time = ~~(+new Date() / 1000)
    let dataInfo = {
      wxgame: {
        score: ~~(Math.random() * 100),
        update_time: time
      }
    }
    let value = JSON.stringify(dataInfo)

    let setModuleNameArr = []
    setModuleNameArr.push({ key: 'score', value })

    let openDataContext = wx.getOpenDataContext()
    openDataContext.postMessage({
      type: 'SET',
      data: setModuleNameArr,
      timer: time
    })
    console.log('给子域发送SET信息完毕')
  }
}
