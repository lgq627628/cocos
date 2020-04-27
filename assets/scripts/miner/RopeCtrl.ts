import Util from "../common/Util";

const {ccclass, property} = cc._decorator;

const enum State {
  Idle,
  Grow,
  BackWithEmpty,
  BackWithTarget,
  Stop
}

class RopeConfig {
  static MAX_ROTATE_ANGLE: number = 70
  static ORIGIN_ROPE_H: number = 150
}

@ccclass
export default class RopeCtrl extends cc.Component {

    @property(cc.Node)
    handNode: cc.Node = null;
    @property(cc.Node)
    goldWrap: cc.Node = null;

    @property({type: cc.Float, tooltip: '绳子左右摇摆速度'})
    rotateSpeed: number = 120;
    @property({type: cc.Float, tooltip: '绳子伸长速度'})
    growSpeed: number = 450;
    @property({type: cc.Float, tooltip: '绳子收回速度'})
    backSpeed: number = 350;

    state: number = State.Idle
    goldNode: cc.Node = null

    onLoad () {
      this.state = State.Idle
      this.node.height = RopeConfig.ORIGIN_ROPE_H
    }

    updateIdle(dt) {
      this.node.angle += this.rotateSpeed * dt
      if (
        (this.node.angle >= RopeConfig.MAX_ROTATE_ANGLE && this.rotateSpeed > 0) ||
        (this.node.angle <= -RopeConfig.MAX_ROTATE_ANGLE && this.rotateSpeed < 0)
      ) {
        this.rotateSpeed = -this.rotateSpeed
      }
    }
    updateGrow(dt) {
      this.node.height += this.growSpeed * dt
    }
    updateBackWithEmpty(dt) {
      this.node.height -= this.backSpeed * dt
      if (this.node.height <= RopeConfig.ORIGIN_ROPE_H) {
        this.state = State.Idle
        this.node.height = RopeConfig.ORIGIN_ROPE_H
      }
    }
    updateBackWithTarget(dt) {
      this.node.height -= this.backSpeed * dt
      this.goldNode.position = this.goldWrap.convertToNodeSpaceAR(this.handNode.convertToWorldSpaceAR(cc.v2(0, 0)))
      if (this.node.height <= RopeConfig.ORIGIN_ROPE_H) {
        this.state = State.Idle
        this.node.height = RopeConfig.ORIGIN_ROPE_H
        this.goldNode.position = cc.v2((Math.random() - 0.5) * cc.winSize.width, Util.random(-300, -50))
      }
    }
    update (dt) {

      switch(this.state) {
        case State.Idle:
          this.updateIdle(dt)
          break;
        case State.Grow:
          this.updateGrow(dt)
          break;
        case State.BackWithEmpty:
          this.updateBackWithEmpty(dt)
          break;
        case State.BackWithTarget:
            this.updateBackWithTarget(dt)
            break;
      }
    }

    throwRope() {
      if (this.state !== State.Idle) return
      this.state = State.Grow
    }
    backRope() {
      if (this.state !== State.Grow) return
      this.state = State.BackWithEmpty
    }
    backRopeWithTarget(goldNode) {
      if (this.state !== State.Grow) return
      this.state = State.BackWithTarget
      this.goldNode = goldNode
    }
}
