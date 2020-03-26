// 游戏逻辑的操作代码要独立出来方便调用
// 王者荣耀一局几十兆
// 如果不够就分步到磁盘，然后清空再来

const CMD_TYPE = {
  ACTION_ONE: 1,
  ACTION_TWO: 2,
}

// 录像信息采集 recordMgr
// cow.js 应该提供 getKeyInfo 和 setKeyInfo 方法，数据可以是数组也可以是对象
const recordMgr = {
  cmdRecords: [], // [[时间戳, 操作类型, 相关数据], [], []]
  pushRecord(cmdType, keyInfo) {
    this.cmdRecords.push([this.getTimestamp(), cmdType, keyInfo])
  },
  getTimestamp() { // 注意这里是毫秒 ms 级别
    return +new Date()
  }
}

// 开始回放

onPlayRecord() {
  if (recordMgr.cmdRecords.length < 1) return

  // 清理当前游戏垃圾
  this.root.removeAllChildren()
  this.rope.stopAllActions()
  this.rope.spriteFrame = this.imgs[0]
  this.unscheduleAllCallbacks()

  // 状态禁止、操作初始化
  this.canOperate = false
  this.nextCmd = 0
  this.prevTime = this.startTime

  // 开始播放
  this.playRecord()
}
playRecord() {
  if (this.nextCmd > recordMgr.cmdRecords.length) return
  let time = recordMgr.cmdRecords[this.nextCmd][0] - this.prevTime
  this.scheduleOnce(function() {
    this.runCmd()
  }.bind(this), time/1000)
}
runCmd() {
  let cmdType = recordMgr.cmdRecords[this.nextCmd][1]
  let keyInfo = recordMgr.cmdRecords[this.nextCmd][2]

  // 此处应该有个事件派发机制
  switch(cmdType) {
    case CMD_TYPE.ACTION_ONE:
      // todo
      break;
    case CMD_TYPE.ACTION_TWO:
      // todo
      break;
  }

  this.prevTime = recordMgr.cmdRecords[this.nextCmd][0]
  this.nextCmd++
  this.playRecord()
}
