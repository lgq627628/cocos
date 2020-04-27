'use strict';

module.exports = {
  load () {
    Editor.log('开始生成 json 文件');

    // 当 package 被正确加载的时候执行
  },

  unload () {
    // 当 package 被正确卸载的时候执行
  },

  messages: {
    'genJson'() {
      Editor.log('开始生成 json 文件');
      const XLSX = require('xlsx')
      const fs = require('fs');
      const path = require('path');
      // 插件加载后在项目根目录自动创建指定文件夹
      let tableName = 'enemy'
      let jsonDir = path.join(Editor.Project.path, 'json')
      let jsonFile = path.join(Editor.Project.path, 'json', `${tableName}.json`)
      let excelFile = path.join(Editor.Project.path, 'excel', 'enemy.xlsx')
      if (!fs.existsSync(jsonDir)) fs.mkdirSync(jsonDir)



      let buf = fs.readFileSync(excelFile);
      let wb = XLSX.read(buf, {type:'buffer'});
      // console.log(wb.SheetNames, wb.Sheets)

      let idx = wb.SheetNames.findIndex(name => name === tableName)
      if (idx < 0) {
        Editor.log('暂无对应的 enemy 表文件内容')
        return
      }
      let ws = wb.Sheets[tableName]

      // defval: 如果值为空还是要显示 key 的
      let rs = XLSX.utils.sheet_to_json(ws, {defval: ''})
      console.log(rs)
      fs.writeFileSync(jsonFile, JSON.stringify(rs, null, 2));
      Editor.log('json 文件生成完毕');
    }
  },
};
