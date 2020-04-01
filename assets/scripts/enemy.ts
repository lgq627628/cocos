const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null; // 目标是可以根据规则来修改的
    @property(cc.Node)
    home: cc.Node = null; // 目标是可以根据规则来修改的

    thinkTime: number = 0.3 // 相当于触发规则
    nowTime: number = 0

    // 下面的设置最好是需要读取配置表的
    attackR: number = 350
    followR: number = 500

    navAgent: any = null
    homePos: cc.Vec2 = null

    onLoad () {
      // this.nowTime = this.thinkTime 视第一次是否要直接执行
      this.navAgent = this.getComponent('navAgent')
      this.homePos = this.home.getPosition()
    }

    doAI() {
      if(!this.target) return

      let start = this.node.getPosition()
      let end = this.target.getPosition()
      let absoluteStart = this.node.convertToWorldSpaceAR(cc.v2(0, 0))
      let absoluteEnd = this.target.convertToWorldSpaceAR(cc.v2(0, 0))
      let dir = end.sub(start)
      let len = dir.mag()

      this.node.getChildByName('label').active = false
      // 决策和行动是需要分开写的
      if (len <= this.attackR) {
        this.navAgent.stopWalk()
        G_CTRL.shootWuqi(absoluteStart, absoluteEnd)
        this.node.getChildByName('label').active = true
      } else if (len <= this.followR) {
        this.navAgent.walkTo(end)
      } else {
        this.navAgent.walkTo(this.homePos)
      }
    }

    update (dt) {
      this.nowTime += dt
      if (this.nowTime >= this.thinkTime) {
        this.nowTime = 0
        this.doAI()
      }
    }
}
