const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    inputMap: object = {}
    speed: number = 200
    heroAnims: cc.Animation = null
    state: string = ''
    dir: cc.Vec2 = null

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

        if (this.dir.x) {
            this.node.x += this.dir.x * this.speed * dt
        } else if (this.dir.y) {
            this.node.y += this.dir.y * this.speed * dt
        } else {

        }

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
