const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    speed: number = 500

    start () {

    }

    update (dt) {
      let dy = this.speed * dt
      this.node.y += dy
    }

    onBeginContact(contact, self, other) {
      if (other.node.name === 'wall') {
        window.zidanPool.put(self.node)
      }
    }
}
