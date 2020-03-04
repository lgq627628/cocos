const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    speed: number = 800

    start () {

    }

    update (dt) {
      let dy = this.speed * dt
      this.node.y += dy
      console.log(window.zidanPool.size())
    }

    onBeginContact(contact, self, other) {
      if (other.node.name === 'wall' || this.node.y > cc.winSize.height / 2) {
        window.zidanPool.put(self.node)
      }
    }
}
