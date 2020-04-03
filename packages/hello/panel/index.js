// 原生的会有些小问题
const fs = require('fire-fs')
const path = require('fire-path')

// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
  // css style for panel
  // 要写绝对路径
  style: fs.readFileSync(Editor.url('packages://hello/panel/index.css'), 'utf-8'),

  // html template for panel
  template: fs.readFileSync(Editor.url('packages://hello/panel/index.html'), 'utf-8'),

  // method executed when template and styles are successfully loaded and initialized
  ready () {
    this.plugin = new window.Vue({
      el: this.shadowRoot,
      data: {
        msg: ''
      },
      created () {

      },
      methods: {
        confirm() {
          const fse = Editor.require('packages://hello/node_modules/fs-extra')
          const dir = path.join(Editor.projectInfo.path, 'tmpDir')
          fse.mkdirSync(dir)
          Editor.Ipc.sendToMain('hello:clicked');
        }
      }
    })
  },

  // register your ipc messages here
  messages: {
    'hello:hello' (event) {
      this.plugin.msg = 'Hello 啊 哈哈哈嗝';
    }
  }
});
