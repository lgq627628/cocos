const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

  body: cc.RigidBody = null

  start() {
    this.body = this.node.getComponent(cc.RigidBody)
  }
  onBeginContact (contact, selfCollider, otherCollider) { // sensor 只能用这个
    console.log(otherCollider.node)
    if (otherCollider.node.name === 'pocket') {
      this.node.active = false
      this.scheduleOnce(this.reset.bind(this), 1)
    }
  }

  reset() {
    this.body.linearVelocity = cc.v2(0, 0)
    this.body.angularVelocity = 0
    this.node.position = cc.v2(0, 0)
    this.node.active = true
  }
}
