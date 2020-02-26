const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    originVY: number = 0

    onBeginContact(contact, self, other) {
      let rigidBody = self.node.getComponent(cc.RigidBody)
      if (this.originVY) {
        rigidBody.linearVelocity = cc.v2(0, this.originVY)
      } else {
        this.originVY = rigidBody.linearVelocity.y
      }
    }

    start () {

    }
}
