const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

  onPreSolve (contact, selfCollider, otherCollider) {
    this.node.active = false
  }
}
