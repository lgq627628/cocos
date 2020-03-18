const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.TiledMap)
    tiledMap: cc.TiledMap = null;

    start () {
      this.initTiled('wall', 'wall')
      this.initTiled('fire', 'wall')
    }

    initTiled(layerName, groupName) {
      let tiledSize = this.tiledMap.getTileSize()
      let layer = this.tiledMap.getLayer(layerName)
      let {width, height} = layer.getLayerSize()

      for(let i = 0; i < width; i++) {
        for(let j = 0; j < height; j++) {
          let tiled = layer.getTiledTileAt(i, j, true)
          if (tiled.gid !== 0) {
            tiled.node.group = groupName

            let body = tiled.node.addComponent(cc.RigidBody)
            body.type = cc.RigidBodyType.Static

            let collider = tiled.node.addComponent(cc.PhysicsBoxCollider)
            collider.offset = cc.v2(tiledSize.width/2, tiledSize.height/2)
            collider.size = tiledSize
            collider.apply()
          }
        }
      }
    }

    update (dt) {}
}
