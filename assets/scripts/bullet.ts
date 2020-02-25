const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    speed: number = 300;

    start () {
      // 角度转弧度
      let r = cc.misc.degreesToRadians(this.node.angle)
      // 弧度转向量
      let v2 = cc.v2(0, 1).rotate(r)

      // 按照向量进行移动
      this.getComponent(cc.RigidBody).linearVelocity = cc.v2(v2.x * this.speed, v2.y * this.speed)
    }

    onBeginContact() {
      console.log('子弹销毁了')
      this.node.destroy()
    }

    // update (dt) {}
}
