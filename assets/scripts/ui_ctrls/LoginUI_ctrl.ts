import UI_CTRL from '../common/UI_CTRL'
import { UI_MGR } from '../common/UI_MGR'

const {ccclass, property} = cc._decorator

@ccclass
export default class NewClass extends UI_CTRL {

  username: cc.EditBox = null
  pwd: cc.EditBox = null

	onLoad () {
    UI_CTRL.prototype.onLoad.call(this)
    UI_MGR.addBtnEvent(this.view['startBtn'], this.onClickStart , this)

    this.username = this.view['username'].getComponent(cc.EditBox)
    this.pwd = this.view['pwd'].getComponent(cc.EditBox)
  }

  onClickStart() {
    console.log('点击了按钮', `用户名为${this.username.string}`, `密码为${this.pwd.string}`)
  }

}
