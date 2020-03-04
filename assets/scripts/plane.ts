const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    coinNode: cc.Node = null
    @property(cc.Node)
    topCoinNode: cc.Node = null
    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null
    @property(cc.Node)
    aircraft: cc.Node = null;
    @property(cc.Node)
    launchPoint: cc.Node = null;
    @property(cc.Prefab)
    zidanPrefab: cc.Prefab = null

    coinPool: cc.NodePool = null
    zidanPool: cc.NodePool = null
    initCoinCount: number = 16
    initZidanCount: number = 16

    onLoad () {
      this.createCoinPool()
      this.createZidanPool()
      this.coinNode.on(cc.Node.EventType.MOUSE_DOWN, this.collectCoin.bind(this), this)
      this.node.on(cc.Node.EventType.MOUSE_MOVE, this.moveAircraft.bind(this), this)
      this.node.on(cc.Node.EventType.MOUSE_MOVE, this.moveAircraft.bind(this), this)
    }

    moveAircraft(e) {
      let pos = e.getLocation()
      pos = this.node.convertToNodeSpaceAR(pos)
      this.aircraft.position = pos
      this.schedule(this.launchZidan, .2);
    }

    launchZidan() {
      let zidan = null;
      if (this.zidanPool.size() > 0) {
          zidan = this.zidanPool.get()
      } else {
          zidan = cc.instantiate(this.zidanPrefab)
      }
      let pos = this.launchPoint.convertToWorldSpaceAR(cc.v2(0, 0))
      pos = this.node.convertToNodeSpaceAR(pos)
      zidan.position = pos
      zidan.parent = this.node
    }

    stopLaunch() {
      console.log('停止发射')
      this.unschedule(this.launchZidan);
    }

    collectCoin(e) {
      let startPos = e.target.convertToWorldSpaceAR(cc.v2(0, 0))
      let endPos = this.topCoinNode.convertToWorldSpaceAR(cc.v2(0, 0))
      this.createCoinPosAndMove(startPos, endPos, this.node, 200, 16)
    }

    createCoinPosAndMove(startPos, endPos, parent, r, num) {
      startPos = parent.convertToNodeSpaceAR(startPos)
      endPos = parent.convertToNodeSpaceAR(endPos)

      let posArr = this.createRandomCirclePos(startPos.x, startPos.y, r, num)
      posArr = this.sortPosArr(posArr, endPos.x, endPos.y)

      posArr.forEach((pos, i) => {
        let coin = null;
        if (this.coinPool.size() > 0) {
            coin = this.coinPool.get()
        } else {
            coin = cc.instantiate(this.coinPrefab)
        }
        coin.position = startPos
        coin.parent = parent
        cc.tween(coin)
          .to(0.4, { position: cc.v2(pos.x, pos.y) })
          .delay(i * 0.02)
          .to(0.5, { position: cc.v2(endPos.x, endPos.y) })
          .call(() => {
            this.coinPool.put(coin)
          })
          .start()
      })
    }

    sortPosArr(arr, targetX, targetY) {
      return arr.sort((a, b) => {
        let l1 = Math.pow(a.x - targetX, 2) + Math.pow(a.y - targetY, 2)
        let l2 = Math.pow(b.x - targetX, 2) + Math.pow(b.y - targetY, 2)
        return l1 - l2
      })
    }

    createRandomCirclePos(x, y, r, num) {
      let posArr = []
      let rad = cc.misc.degreesToRadians(~~(360 / num))
      for(let i = 0; i < num; i++) {
        let posX = x + r * Math.sin(rad * i) + this.randomNum(-40, 40)
        let posY = y + r * Math.cos(rad * i) + this.randomNum(-40, 40)
        posArr.push({x: posX, y: posY})
      }
      return posArr
    }

    randomNum(min, max) {
      return ~~(Math.random() * (max - min) + min)
    }

    createCoinPool() {
      this.coinPool = new cc.NodePool()
      for(let i = 0; i < this.initCoinCount; i++) {
        let coin = cc.instantiate(this.coinPrefab)
        this.coinPool.put(coin)
      }
    }

    createZidanPool() {
      this.zidanPool = new cc.NodePool()
      for(let i = 0; i < this.initZidanCount; i++) {
        let zidan = cc.instantiate(this.zidanPrefab)
        this.zidanPool.put(zidan)
      }
      window.zidanPool = this.zidanPool
    }

    onBeginContact(contact, self, other) {
      console.log('碰撞了')
      console.log(self, other)

      // let rigidBody = self.node.getComponent(cc.RigidBody)
      // if (this.originVY) {
      //   rigidBody.linearVelocity = cc.v2(0, this.originVY)
      // } else {
      //   this.originVY = rigidBody.linearVelocity.y
      // }

    }

    update (dt) {

    }
}
