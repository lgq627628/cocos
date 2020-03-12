import Util from './common/Util'
import {G, Wechat} from './common/Global'
const {ccclass, property} = cc._decorator;

@ccclass
export default class Paopaolong extends cc.Component {

    @property(cc.Node)
    avatarNode: cc.Node = null
    @property(cc.Label)
    nickName: cc.Label = null
    @property(cc.Node)
    bubbleLayer: cc.Node = null
    @property(cc.Prefab)
    bubblePrefab: cc.Prefab = null
    @property(cc.Node)
    shooter: cc.Node = null
    @property(cc.JsonAsset)
    levelData: cc.JsonAsset = null

    bubbleArr: cc.Node[][] = []
    nowBubble: cc.Node = null
    isShooting: boolean = false
    isWalking: boolean = false
    shootDir: cc.Vec2 = null
    nowLevel: number = 1
    shooterPos: cc.Vec2 = null
    shootSpeed: number = 2500

    onLoad () {
      this.initWexin()
      this.shooterPos = this.shooter.position
      this.initLevel(this.nowLevel)
      this.openTouch()
      this.createRandomBubble()
    }

    initWexin() {
      wx.login({
        timeout:10000,
        success: (result) => {
          console.log('成功了', result)
        },
        fail: e => {
          console.log('失败了', e)
        },
        complete: e => {
          console.log('完成了', e)
        }
      });
      let button = wx.createUserInfoButton({
        type: 'text',
        text: '开始游戏',
        style: {
          left: wx.getSystemInfoSync().screenWidth / 2 - 100,
          top: wx.getSystemInfoSync().screenHeight / 2 - 20,
          width: 200,
          height: 40,
          lineHeight: 40,
          backgroundColor: '#fb94a9',
          color: '#ffffff',
          textAlign: 'center',
          fontSize: 16,
          borderRadius: 10
        }
      })
      button.show()
      button.onTap((res) => {
        console.log(res)
        if (res.errMsg === 'getUserInfo:ok') {
          console.log('获取用户信息成功')
          // todo 注册用户信息
          Wechat.onRegisterUser(res.userInfo, this.initUser.bind(this))
          Wechat.onRightUpShare()
          button.destroy()
        } else {
          console.log('获取用户信息失败')
        }
      })
    }

    initUser() {
      console.log('G.userInfo', G.userInfo)
      if (!G.userInfo) return
      console.log('执行了啦啦啦啦初始化用户信息')
      let url = G.userInfo.avatarUrl
      cc.loader.load({
        url,
        type: 'jpg'
      }, (err, texture) => {
        let frame = new cc.SpriteFrame(texture)
        if (err) {
          console.log('用户头像', err)
        }
        this.avatarNode.getComponent(cc.Sprite).spriteFrame = frame
      })
      this.nickName.getComponent(cc.Label).string = G.userInfo.nickName
    }

    onShare() {
      Wechat.onShare()
    }

    reset() {
      this.bubbleArr.forEach(row => {
        row.forEach(col => {
          if (col) col.parent = null
        })
      })
      this.nowBubble && (this.nowBubble.parent = null)
      this.bubbleArr = []
      this.nowBubble = null
      this.isShooting = false
      this.shootDir = null
      this.nowLevel = 1
      this.isWalking = false
      this.initLevel(this.nowLevel)
      this.createRandomBubble()
    }

    createRandomBubble() {
      this.isWalking = false
      let nowBubble = cc.instantiate(this.bubblePrefab)
      nowBubble.getComponent('Bubble').init(this.bubbleLayer, this.shooterPos, Util.random(1, 4))
      this.nowBubble = nowBubble
    }

    convertEventToDegree(e) {
      let {x, y} = e.getLocation()
      let { x: x0, y: y0 } = this.shooterPos
      let rad = Math.atan2(y - y0, x - x0)
      let angle = cc.misc.radiansToDegrees(rad)
      if (angle < 20 || angle > 160) return
      this.shootDir = cc.v2(Math.cos(rad), Math.sin(rad))
      this.shooter.angle = angle - 90
    }

    _touchStart(e) {
      if (this.isShooting || this.isWalking) return
      this.convertEventToDegree(e)
    }

    _touchsMove(e) {
      if (this.isShooting || this.isWalking) return
      this.convertEventToDegree(e)
    }

    _touchEnd(e) {
      if (this.isShooting || this.isWalking) return
      this.isShooting = true
      this.convertEventToDegree(e)
    }

    openTouch() {
      this.node.on(cc.Node.EventType.TOUCH_START, this._touchStart, this);
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this._touchsMove, this);
      this.node.on(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
    }

    closeTouch () {
      this.node.off(cc.Node.EventType.TOUCH_START, this._touchStart, this);
      this.node.off(cc.Node.EventType.TOUCH_MOVE, this._touchsMove, this);
      this.node.off(cc.Node.EventType.TOUCH_END, this._touchEnd, this);
    }

    onDestroy() {
      this.closeTouch()
    }

    initLevel(level) {
      let data = this.levelData.json[level]
      data.forEach((row, i) => {
        this.bubbleArr[i] = []
        row.forEach((col, j) => {
          if (col !== 0) {
            let b = cc.instantiate(this.bubblePrefab)
            let pos = this.convertRowColToPos(i, j)
            b.getComponent('Bubble').init(this.bubbleLayer, pos, col)
            this.bubbleArr[i][j] = b;
          }
        })
      })
    }

    convertRowColToPos(i, j) {
      let x = Util.BUBBLE_R + i % 2 * Util.BUBBLE_R + 2 * Util.BUBBLE_R * j
      let y = Util.SCREEN_H - (Util.BUBBLE_OFFEST_Y * i + Util.BUBBLE_R)
      return cc.v2(x, y) // 绝对坐标
    }

    convertPosToRowCol(pos) { // 绝对坐标
      let {x, y} = pos
      let i = Math.round((Util.SCREEN_H - y - Util.BUBBLE_R) / Util.BUBBLE_OFFEST_Y)
      let j = Math.round((x - Util.BUBBLE_R - i % 2 * Util.BUBBLE_R) / (2 * Util.BUBBLE_R))
      if (i < 0) i = 0
      if (j < 0) j = 0
      return {i, j}
    }

    update (dt) {
      if (!this.isShooting) return
      this.moveBubble(dt)
      this.checkHit()
    }

    checkHit() {
      for(let i = 0; i < this.bubbleArr.length; i++) {
        for(let j = 0; j < this.bubbleArr[i].length; j++) {
          let b = this.bubbleArr[i][j]
          if (!b) continue
          let ts = b.getComponent('Bubble')
          if (!ts.color) continue
          if (Math.abs(b.position.y - this.nowBubble.position.y) > 2 * Util.BUBBLE_R ) continue
          if (Math.abs(b.position.x - this.nowBubble.position.x) > 2 * Util.BUBBLE_R ) continue
          // 可以先单独判断 y 轴和 x 轴方向是的距离是否大于直径，大于就 continue，可以少算一些乘法，提高性能
          let isHit = b.position.sub(this.nowBubble.position).mag() < 2 * Util.BUBBLE_R
          if (isHit) {
            this.isShooting = false
            this.modifyBubblePos()
            return
          }
        }
      }
      if (this.nowBubble.y >= Util.SCREEN_H - Util.BUBBLE_R) { // 没碰到其他泡泡，但是到达屏幕顶端
        this.isShooting = false
        this.modifyBubblePos()
      }
    }

    modifyBubblePos() {
      let {i, j} = this.convertPosToRowCol(this.nowBubble.position)
      this.nowBubble.position = this.convertRowColToPos(i, j)
      if (this.bubbleArr[i]) {
        this.bubbleArr[i][j] = this.nowBubble
        this.walkAroundBubble(i, j)
      } else {
        console.log('到底了，你输了')
        this.reset()
      }
    }

    walkAroundBubble(i, j) {
      this.isWalking = true
      // 标记相同颜色的泡泡
      this.markSameColorBubble(i, j, this.nowBubble.getComponent('Bubble').color)
      let sameColorCount = 0
      let needRemoveArr = []
      this.bubbleArr.forEach((row, m) => {
        row.forEach((col, n) => {
          if (col) {
            let ts = col.getComponent('Bubble')
            if (ts.isSameColor) {
              ts.isSameColor = false
              ts.isVisited = false
              sameColorCount++
              needRemoveArr.push({row: m, col: n})
            } else {
              ts.isSameColor = false
              ts.isVisited = false
            }
          }
        })
      })
      // 如果相同颜色的泡泡大于等于 3，就消除这些同色泡泡
      if (sameColorCount >= 3 ) {
        needRemoveArr.forEach(pos => {
          let b = this.bubbleArr[pos.row][pos.col]
          this.bubbleArr[pos.row][pos.col] = null
          b.getComponent('Bubble').playDieAnim()
        })
        this.scheduleOnce(this.walkLinkBubble, 0.3); // 这个时间得在上面动画时间之后
      } else {
        this.createRandomBubble()
      }
    }

    markSameColorBubble(i, j, color) {
      if (!this.bubbleArr[i] || !this.bubbleArr[i][j]) return
      let b = this.bubbleArr[i][j].getComponent('Bubble')
      if (b.isVisited) return
      if (b.color !== color) return
      b.isSameColor = true
      b.isVisited = true

      let row = i
      let col = i % 2 ? j : j - 1
      // 围绕周围递归
      this.markSameColorBubble(row, col - 1, color)
      this.markSameColorBubble(row, col + 1, color)
      this.markSameColorBubble(row - 1, col, color)
      this.markSameColorBubble(row - 1, col + 1, color)
      this.markSameColorBubble(row + 1, col, color)
      this.markSameColorBubble(row + 1, col + 1, color)
    }

    walkLinkBubble() {
      // 这里主要负责悬空泡泡的检测
      // 就是从上到下遍历泡泡，有访问到就是有连接，因为如果没访问到，中途就会断开连接，就不会遍历到
      for(let j = 0; j < this.bubbleArr[0].length; j++) {
        this.markLinkBubble(0, j)
      }
      let hasUnlink = false
      this.bubbleArr.forEach((row, i) => {
        row.forEach((col, j) => {
          if (col) {
            let ts = col.getComponent('Bubble')
            if (ts.isLinked) {
              ts.isLinked = false
              ts.isVisited = false
            } else {
              hasUnlink = true
              this.bubbleArr[i][j] = null
              ts.playDropAnim()
            }
          }
        })
      })
      if (hasUnlink) {
        this.scheduleOnce(this.createRandomBubble, 0.4)
      } else {
        this.createRandomBubble()
      }
    }

    markLinkBubble(i, j) {
      if (!this.bubbleArr[i] || !this.bubbleArr[i][j]) return
      let b = this.bubbleArr[i][j].getComponent('Bubble')
      if (b.isVisited) return
      b.isVisited = true
      b.isLinked = true

      let row = i
      let col = i % 2 ? j : j - 1
      // 围绕周围递归
      this.markLinkBubble(row, col - 1)
      this.markLinkBubble(row, col + 1)
      this.markLinkBubble(row - 1, col)
      this.markLinkBubble(row - 1, col + 1)
      this.markLinkBubble(row + 1, col)
      this.markLinkBubble(row + 1, col + 1)
    }

    moveBubble(dt) {
      if (this.nowBubble.x > cc.winSize.width - Util.BUBBLE_R || this.nowBubble.x < Util.BUBBLE_R) {
        this.shootDir.x = - this.shootDir.x
      }
      let dx = this.shootSpeed * this.shootDir.x * dt
      let dy = this.shootSpeed * this.shootDir.y * dt
      this.nowBubble.x += dx
      this.nowBubble.y += dy
    }
}
