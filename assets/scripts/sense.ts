const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    sense: cc.Node = null;
    MAX_R: number = 100;
    direction: cc.Vec2; // 单位向量，也代表 cos 和 sin
    speed: number = 200;
    @property(cc.Node)
    tank: cc.Node = null;
    @property(cc.Node)
    box: cc.Node = null;
    @property(cc.Node)
    camera: cc.Node = null;
    offset: cc.Vec2 = cc.v2(0, 0)

    start () { // 初始化
        if (this.camera) { // 相机和玩家的位置差
          this.offset = this.camera.getPosition().sub(this.tank.getPosition())
        }


        this.direction = cc.v2(0, 0)
        this.sense.setPosition(cc.v2(0, 0))
        this.sense.on(cc.Node.EventType.TOUCH_START, e => {

        })
        this.sense.on(cc.Node.EventType.TOUCH_MOVE, e => {
            let screenPos = e.getLocation() // 全局坐标
            let pos = this.box.convertToNodeSpaceAR(screenPos) // 转到父级坐标系下
            let len = pos.mag()
            this.direction.x = pos.x / len // cos
            this.direction.y = pos.y / len // sin
            if (len > this.MAX_R) {
                pos.x = pos.x * this.MAX_R / len
                pos.y = pos.y * this.MAX_R / len
            }
            this.sense.setPosition(pos)
            // 遥感要么传递角度出来，要么传递向量出来
            // 这里我们用向量，并且是单位向量（就是向量到原点的长度为 1）
        })
        this.sense.on(cc.Node.EventType.TOUCH_END, e => {
            this.sense.setPosition(cc.v2(0, 0))
            this.direction = cc.v2(0, 0)

        })
        this.sense.on(cc.Node.EventType.TOUCH_CANCEL, e => { // 节点外弹起
            this.sense.setPosition(cc.v2(0, 0))
            this.direction = cc.v2(0, 0)
        })
    }

    update (dt) { // dt 距离上次刷新所用去的时间
        if (this.camera) {
          this.camera.x = this.tank.x + this.offset.x
          this.camera.y = this.tank.y + this.offset.y
        }

        if (this.direction.x === 0 && this.direction.y === 0) return
        let vx = this.speed * this.direction.x
        let vy = this.speed * this.direction.y
        let sx = vx * dt
        let sy = vy * dt
        this.tank.x += sx
        this.tank.y += sy
        console.log(this.direction)

        // 已知向量求角度
        let r = Math.atan2(this.direction.y, this.direction.x)
        let angle = 360 * r / (2 * Math.PI)
        angle = angle - 90
        this.tank.angle = angle
        // 在数学中，逆时针为正，x 轴为正方向，
        // cocos 中的正方向是 y 轴，angle 也是逆时针为正，而 rotation 是顺时针为证
        // this.getComponent(cc.RigidBody).linearVelocity = cc.v2(vx, vy)
    }
}
