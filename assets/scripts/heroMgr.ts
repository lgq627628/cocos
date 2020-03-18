const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    inputMap: object = {}
    speed: number = 200
    heroAnims: cc.Animation = null
    state: string = ''
    dir: cc.Vec2 = null
    linearV: cc.Vec2 = null

    onLoad () {
        cc.systemEvent.on('keydown', this.onKeyDown, this)
        cc.systemEvent.on('keyup', this.onKeyUp, this)
        this.dir = cc.v2(0, 0)
        this.heroAnims = this.node.getComponent(cc.Animation)
    }

    setState(state) {
        if (this.state === state) return
        this.state = state
        this.heroAnims.play(this.state)
    }

    onKeyDown(e) {
        this.inputMap[e.keyCode] = 1
    }

    onKeyUp(e) {
        this.inputMap[e.keyCode] = 0
    }

    update (dt) {
        if (this.inputMap[cc.macro.KEY.a] || this.inputMap[cc.macro.KEY.left]) {
            this.dir.x = -1
        } else if (this.inputMap[cc.macro.KEY.d] || this.inputMap[cc.macro.KEY.right]) {
            this.dir.x = 1
        } else {
            this.dir.x = 0
        }

        if (this.inputMap[cc.macro.KEY.w] || this.inputMap[cc.macro.KEY.up]) {
            this.dir.y = 1
        } else if (this.inputMap[cc.macro.KEY.s] || this.inputMap[cc.macro.KEY.down]) {
            this.dir.y = -1
        } else {
            this.dir.y = 0
        }


        this.linearV = this.node.getComponent(cc.RigidBody).linearVelocity

        if (this.dir.x) {
          this.linearV.x = this.dir.x * this.speed
          this.linearV.y = 0
        } else if (this.dir.y) {
          this.linearV.x = 0
          this.linearV.y = this.dir.y * this.speed
        } else {
          this.linearV.x = 0
          this.linearV.y = 0
        }

        this.node.getComponent(cc.RigidBody).linearVelocity = this.linearV

        let state = ''
        if (this.dir.x === -1) {
            state = 'leftHero'
        } else if (this.dir.x === 1) {
            state = 'rightHero'
        } else if (this.dir.y === -1) {
            state = 'downHero'
        } else if (this.dir.y === 1) {
            state = 'upHero'
        }

        if (state) this.setState(state)
    }
}
