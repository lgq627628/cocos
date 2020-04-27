import RopeCtrl from './RopeCtrl'
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(RopeCtrl)
    ropeCtrl: RopeCtrl = null;

    onLoad () {
      this.node.on(cc.Node.EventType.TOUCH_START, this.throwRope, this)
    }

    throwRope() {
      this.ropeCtrl.throwRope()
    }

    update (dt) {}
}
