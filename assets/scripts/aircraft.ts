const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    aircraft: cc.Node = null;

    onLoad () {
    }



    // update (dt) {}
}
