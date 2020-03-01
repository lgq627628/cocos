const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    mario: cc.Node = null
    marioBody: cc.RigidBody = null

    dir: number = 0

    start () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        this.marioBody = this.mario.getComponent(cc.RigidBody)
    }

    onKeyUp(e) {
        switch(e.keyCode) {
            case cc.macro.KEY.left:
                this.dir = 0;
                break;
            case cc.macro.KEY.right:
                this.dir = 0;
                break;
            case cc.macro.KEY.space:
                break;
        }
    }

    onKeyDown(e) {
        switch(e.keyCode) {
            case cc.macro.KEY.left:
                this.dir = -1;
                break;
            case cc.macro.KEY.right:
                this.dir = 1;
                break;
            case cc.macro.KEY.space:
                this.jump()
                break;
        }
    }

    update (dt) {
        if (this.dir === 0) return
        this.walk()
    }

    walk() {
        let v = this.marioBody.linearVelocity
        v.x = 200 * this.dir
        this.mario.scaleX = this.dir * 0.2
        this.marioBody.linearVelocity = v
    }

    jump() {
        let v = this.marioBody.linearVelocity
        v.y += 400
        this.marioBody.linearVelocity = v
    }
}
