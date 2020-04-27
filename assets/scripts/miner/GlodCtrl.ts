import RopeCtrl from "./RopeCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

  @property(RopeCtrl)
  ropeCtrl: RopeCtrl = null;

  onCollisionEnter (other, self) {
    this.ropeCtrl.backRopeWithTarget(this.node)
  }
}
