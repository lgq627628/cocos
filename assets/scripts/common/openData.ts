// 排行榜开防域相关
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    rankWrap: cc.Node = null;
    @property(cc.Prefab)
    rankItemPrefab: cc.Prefab = null;

    start () {
      let self = this
      console.log('开始监听从主域发来的信息')
      wx.onMessage((readData) => {
        console.log('收到了从主域发来的信息', readData)
        if (readData.type === 'GET') {
          // 清空排行榜列表
          let children = this.rankWrap.children
          children.forEach(item => {
            item.destroy()
          })
          // 获取好友列表
          wx.getFriendCloudStorage({
            keyList: readData.data,
            success(res) {
              let tempArr = []
              console.log('好友列表：', res.data, readData.data)
              res.data.forEach(d => {
                let score = JSON.parse(d.KVDataList[0].value).wxgame.score
                tempArr.push(score)
                // 排序
                tempArr.sort((a, b) => b - a)
                // 匹配
                console.log(tempArr)
                let index = 0
                while(index < tempArr.length) {
                  // 生成排行版的数据
                  for(let i = 0; i < res.data.length; i++) {
                    let score = JSON.parse(res.data[i].KVDataList[0].value).wxgame.score
                    if (tempArr[index] === score) {
                      console.log('每一个item', res.data[i])
                      self.xx(res.data[i])
                      res.data.splice(i, 1)
                      break
                    }
                  }
                  index++
                }
              })
            }
          });
          // 生成最新的预制体
        } else if (readData.type === 'SET') {
          // 设置微信后台数据存储
          wx.setUserCloudStorage({
            KVDataList: readData.data,
            success(res) {
              console.log('存储成功', res, readData.data)
            },
            fail(err) {
              console.error(err)
            },
            complete(res) {

            }
          })
        }
      });
    }

    xx(user) {
      let node = cc.instantiate(this.rankItemPrefab)
      node.parent = this.rankWrap
      node.x = 0
      node.getChildByName('name').getComponent(cc.Label).string = user.nickName || user.nickname
      node.getChildByName('score').getComponent(cc.Label).string = JSON.parse(user.KVDataList[0].value).wxgame.score
      cc.loader.load({
        url: user.avatarUrl,
        type: 'png'
      }, (err, texture) => {
        if (err) console.error(err)
        node.getChildByName('mask').children[0].getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture)
      })
    }
}
