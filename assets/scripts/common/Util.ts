export default class Util {
  static readonly SCREEN_W: number = 720
  static readonly SCREEN_H: number = 1280
  static readonly BUBBLE_R: number = 40
  static readonly BUBBLE_OFFEST_Y: number = 40 * Math.sqrt(3) //  y 轴偏差

  static random(min: number, max: number): number {
    return Math.floor(Math.random() * Math.abs(max - min + 1)) + min
  }

  static changeSpriteFrame(sprtie: cc.Sprite, frames: cc.SpriteFrame[], percent: number): cc.SpriteFrame {
    sprtie.spriteFrame = frames[Math.floor(frames.length * percent)]
    return sprtie.spriteFrame
  }
}
