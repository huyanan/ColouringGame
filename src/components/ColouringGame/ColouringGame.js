/**
 * 填色游戏
 * 游戏的流程如下：
 * 1. 创建画布
 * 2. 加载初始化资源
 * 3. 初始化画布、初始化图形
 *  根据json
 * 4. 提供填色的接口
 * 5. 点击图形填色
 */
const ColouringGame = {}
// 游戏初始化
ColouringGame.init = function({container, width, height}) {
  // 创建画布
  this.canvas = ColouringGame.createCanvas(width, height)
  // canvas2d context
  this.context = this.canvas.getContext('2d')
  // 游戏画布的容器
  this.container = container
  // 将画布追加到容器中
  this.container.appendChild(this.canvas)
}
// 创建画布
ColouringGame.createCanvas = function(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}
// 创建精灵
ColouringGame.createSprite = function ({x, y, width, height, image}) {
  const sprite = new Sprite({x, y, width, height, image})
  return sprite
}

// 加载资源
ColouringGame.loadResources = function(resources) {
}

// 资源管理
class Assets {
  constructor(resources) {
    this.resources = resources
    this.loaded = 0
    this.total = resources.length
  }
  load() {}
}

// 精灵
class Sprite {
  constructor({x, y, width, height, image}) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.image = image
  }
  draw() {
    this.context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}

export default ColouringGame