export const UI_MGR = {
  addBtnEvent(node, fn, caller) {
    let btn = node.getComponent(cc.Button)
    if (btn) {
      node.on('click', fn, caller)
    }
  },
  showUIAt(parent, uiName) {
    cc.loader.loadRes(`uiPrefab/${uiName}`, function(err, prefab) {
      let item = cc.instantiate(prefab)
      parent.addChild(item)
      item.addComponent(`${uiName}_ctrl`)
    })
  }
}
