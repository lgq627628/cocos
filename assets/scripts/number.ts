const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;
    // @property(cc.Node)
    // startBtn: cc.Node = null;
    // @property(cc.Node)
    // playBtn: cc.Node = null;
    // @property(cc.Node)
    // pauseBtn: cc.Node = null;

    numHeight: number = 0
    speed: number = 300
    nowNum: number = 0
    recorderManager: any = null
    innerAudioContext: any = null
    tempFilePath: any = null

    onLoad () {
      this.numHeight = this.content.height / this.content.children.length
      // this.setNum(5)
      // this.scrollToNum(0)
      this.setNum(0)
      this.scrollToNum(5)

      this.addRecordEvent()
    }

    addRecordEvent() {
      const recorderManager = wx.getRecorderManager()

      recorderManager.onStart(() => {
        this.startRecord()
        console.log('recorder start')
      })
      recorderManager.onPause(() => {
        console.log('recorder pause')
        this.pauseRecord()
      })
      recorderManager.onStop((res) => {
        this.stopRecord()
        console.log('recorder stop', res)
        const { tempFilePath } = res
        this.tempFilePath = tempFilePath
      })
      recorderManager.onFrameRecorded((res) => {
        const { frameBuffer } = res
        console.log('frameBuffer.byteLength', frameBuffer.byteLength)
      })

      // const options = {
      //   duration: 10000,
      //   sampleRate: 44100,
      //   numberOfChannels: 1,
      //   encodeBitRate: 192000,
      //   format: 'aac',
      //   frameSize: 50
      // }

      this.recorderManager = recorderManager
      // recorderManager.start(options)

      this.innerAudioContext = wx.createInnerAudioContext();
    }

    startRecord() {
      wx.showToast({
        title: '开始录音',
        icon: 'none'
      });
      const options = {
        duration: 10000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'aac',
        frameSize: 50
      }

      this.recorderManager.start(options)
    }

    pauseRecord() {
      wx.showToast({
        title: '暂停录音',
        icon: 'none'
      });
      this.recorderManager.pause()
    }

    resumeRecord() {
      wx.showToast({
        title: '继续录音',
        icon: 'none'
      });
      this.recorderManager.resume()
    }

    stopRecord() {
      wx.showToast({
        title: '结束录音',
        icon: 'none'
      });
      this.recorderManager.stop()
    }

    playRecord() {
      this.innerAudioContext.src = this.tempFilePath;
      this.innerAudioContext.play();
    }

    getScore() {
      let api = 'https://dick-wechatgame.meishakeji.com/api/wechat/v1/oral_assessment/evaluate'
      wx.uploadFile({
        url: api,
        filePath: files[i],
        name: 'file',
        header: {
          'Content-Type': 'multipart/form-data'
        },
        complete: function (res) {
          const data = JSON.parse(res.data);
          _files.push(data.data.url);
          if (_files.length === files.length) {
            resolve(_files);
          }
        }
      });
    }

    setNum(num) {
      this.nowNum = num
      this.content.y = this.numHeight / 2 + num * this.numHeight
    }

    scrollToNum(num) {
      if (this.nowNum > num) num += 10
      let dis = (num - this.nowNum) * this.numHeight
      cc.tween(this.content)
        .by(dis/this.speed, {y: dis}, {easing: 'elasticOut'})
        .call(() => {
          this.setNum(num)
          // this.scrollToNum(4)
        })
        .start()
    }

    update (dt) {}
}
