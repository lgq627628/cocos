export enum EventType {
  None,
  CreateTower
}
export enum TowerType {
  None,
  TowerOne,
  TowerTwo
}

export class EventBase {
  eventType: EventType = EventType.None
}

export class EventCreateTower extends EventBase {
  eventType: EventType = EventType.CreateTower
  towerType: TowerType.TowerOne
  towerPos: cc.Vec2
}


