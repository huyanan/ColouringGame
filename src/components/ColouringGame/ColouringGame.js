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
class ColouringGame {
  constructor (options) {
    this.init(options)
  }
  // 游戏框架初始化
  init ({container, width, height, onClickPart, onAllPartsPainted, config, debug}) {
    // 配置
    this.config = {
      gameColors: {
        selectedBorderColor: '#0000ff'
      },
      maxScale: 8,
      minScale: 0.4,
      scaleStep: 0.1,
      ...config
    }
    this.debug = debug
    // 创建画布
    this.canvas = this.createCanvas(width, height)
    // canvas2d context
    this.context = this.canvas.getContext('2d')
    // 坐标偏移
    this.offsetX = 0
    this.offsetY = 0
    // 当前偏移
    this.curOffset = {
      x: 0,
      y: 0
    }
    // 缩放
    this.prevScale = 1
    this.scale = 1
    this.maxScale = this.config.maxScale || 8; // 缩放最大倍数（缩放比率倍数）
    this.minScale = this.config.minScale || 0.4; // 缩放最小倍数（缩放比率倍数）
    this.mousePos = {
      x: 0,
      y: 0
    }
    // 缩放 scaleStep
    this.scaleStep = this.config.scaleStep || 0.2
    // 游戏画布的容器
    this.container = container
    // 将画布追加到容器中
    this.container.appendChild(this.canvas)
    // 初始化资源管理器
    this.assetsManager = this.createAssetsManager()
    // 游戏元数据
    this.gameData = null;
    // 底板
    this.backplace = null;
    // 零件集合
    this.parts = []
    // 画笔
    this.pen = new Pen({
      color: null
    });
    // 颜料盘
    this.palette = new Palette()
    // 当前选中零件
    this.currentSelectedPart = null
    // 点击零件
    this.onClickPart = onClickPart
    // 当所有零件都被上色的回调
    this.onAllPartsPainted = onAllPartsPainted
    // 渲染对象列表
    this.children = []
    // 追加事件
    this.addEvents()
  }
  //
  /**
   * 游戏初始化
   * 数据格式错误将导致初始化失败
   * @param {*} gameData 
   */
  initGame (gameData) {
    try {
      console.log('initGame', {
        gameData
      })
      let {
        palette,
        backplace,
        // colouringGameDataList
      } = gameData
      this.gameData = gameData;
      // 默认选中第一张图
      // if (Array.isArray(colouringGameDataList) && colouringGameDataList.length > 0) {
      //   this.changeDraw(colouringGameDataList[0])
      // }
      if (backplace) {
        this.changeDraw(backplace)
      }

      // 初始化颜料盘
      this.initPalette({
        palette
      });

      // 开始绘制
      this.startRender()
    } catch (error) {
      console.error('游戏初始化失败', error)
    }
  }
  startRender () {
    this.render();
  }

  // 绘制
  render () {
    const self = this;
    this.clear();
    this.context.translate(this.offsetX, this.offsetY)
    this.context.scale(this.scale, this.scale)
    this.context.beginPath();
    function renderChildren (node) {
      if (Array.isArray(node.children)) {
        // 绘制列表
        node.children.forEach(child => {
          self.draw(child)
          renderChildren(child)
        })
      }
    }
    renderChildren(this)
    this.context.closePath();
    window.requestAnimationFrame(this.render.bind(this))
  }
  clear () {
    let size = 10000000
    // this.context.clearRect(this.offsetX * -1,this.offsetY * -1,this.canvas.width, this.canvas.height);
    // this.context.clearRect(size*-1,size*-1,size*2, size*2);
    this.canvas.width = this.canvas.width;

  };
  draw (node) {
    if(node.image){
      this.context.drawImage(node.image, node.x, node.y, node.width, node.height)
    } else {
        THIS.context.fillStyle= O.color;
        THIS.context.fillRect(O.CONST_BUF_X, O.CONST_BUF_Y, O.w, O.h);
    }
  }
  isAllPartsPainted () {
    let flag = true
    if (Array.isArray(this.parts)) {
      this.parts.forEach(part => {
        if (!part.painted) {
          flag = false
          return false
        }
      })
    }
    return flag
  }
  getParts () {
    return this.parts
  }
  generateImage () {
    let scale = this.scale;
    let offsetX = this.offsetX;
    let offsetY = this.offsetY;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.render();
    return this.canvas.toDataURL();
  }
}

// 移动视角
ColouringGame.prototype.moveCamera= function (x,y) {
  this.context.translate(x, y)
  this.offsetX += x;
  this.offsetY += y;
  // this.context.setTransform(0, 0, 0, 0, x, y);
}
ColouringGame.prototype.zoomIn= function () {
  // this.context.translate(x, y)
  // this.offsetX += x;
  // this.offsetY += y;
  // this.context.setTransform(0, 0, 0, 0, x, y);
  this.scale += this.scaleStep;
  if (this.scale > this.maxScale) {
    this.scale = this.maxScale;
  }
  this.zoom()
}
ColouringGame.prototype.zoomOut= function () {
  // this.context.translate(x, y)
  // this.offsetX += x;
  // this.offsetY += y;
  // this.context.setTransform(0, 0, 0, 0, x, y);
  this.scale -= this.scaleStep;
  if (this.scale < this.minScale) {
    this.scale = this.minScale;
  }
  this.zoom()
}

ColouringGame.prototype.zoom = function () {
  this.offsetX = this.mousePos.x - ((this.mousePos.x - this.offsetX) * this.scale) / this.prevScale;
  this.offsetY = this.mousePos.y - ((this.mousePos.y - this.offsetY) * this.scale) / this.prevScale;
  this.prevScale = this.scale;
  this.curOffset.x = this.offsetX;
  this.curOffset.y = this.offsetY;
}



// 创建画布
ColouringGame.prototype.createCanvas = function(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  // canvas.backgroundColor =
  return canvas
}


// 创建资源管理器
ColouringGame.prototype.createAssetsManager = function() {
  return new AssetsManager()
}
// 加载资源
ColouringGame.prototype.loadAssets = async function(assetsInfoList) {
  const loadImagesRes = await this.assetsManager.loadImages(assetsInfoList);
  console.log('loadAssets', loadImagesRes); 
  return loadImagesRes
}

// 创建精灵
ColouringGame.prototype.createSprite = function ({x, y, w, h, image}) {
  const sprite = new Sprite({
    x,
    y,
    w,
    h,
    image,
    context: this.context
  })
  return sprite
}
// 创建零件
ColouringGame.prototype.createPart = function ({id, name, x, y, w, h, image, zIndex}) {
  const self = this
  const part = new Part({
    id,
    name,
    x,
    y,
    w,
    h,
    image,
    selectedBorderColor: this.config.gameColors.selectedBorderColor,
    context: this.context,
    zIndex,
    render () {},
    onClick () {
      console.log('当点击零件', {
        part
      });
      // this.isSelected = true
      self.currentSelectedPart = part
      self.currentSelectedPart.select();
      if (typeof self.onClickPart === 'function') {
        self.onClickPart(part)
      }
    }
  })
  return part;
}

/**
 * 切换图片
 * 必须按照格式来传，否则图片出不来
 * @param {*} drawData 
 * {
      id: '1',
      name: '大汽车',
      description: '大汽车描述',
      exampleImage: '/assets/exp/A.png',
      backplaceImage: '/assets/ITEMimg/i1/ITEM.jpg',
      parts: [
        {
          id: '1',
          name: '车架',
          description: '骑车车架',
          image: '/assets/img/ITEMimg/1.jpg',
          style: {
            x:10,
            y:39,
            w:488,
            h:365
          }
        },
        {
          id: '2',
          name: '前车窗',
          description: '前车窗',
          image: '/assets/img/ITEMimg/2.jpg',
          style: {
            x:113,
            y:87,
            w:187,
            h:140
          }
        },
        {
          id: '3',
          name: '侧车窗',
          description: '侧车窗',
          image: '/assets/img/ITEMimg/3.jpg',
          style: {
            x:309,
            y:90,
            w:130,
            h:129
          }
        },
        {
          id: '4',
          name: '前右车灯',
          description: '前右车灯',
          image: '/assets/img/ITEMimg/4.jpg',
          style: {
            x:23,
            y:255,
            w:56,
            h:75
          }
        },
        {
          id: '5',
          name: '前左车灯',
          description: '前左车灯',
          image: '/assets/img/ITEMimg/5.jpg',
          style: {
            x:197,
            y:265,
            w:55,
            h:75
          }
        },
        {
          id: '6',
          name: '前车保险杠',
          description: '前车保险杠',
          image: '/assets/img/ITEMimg/6.jpg',
          style: {
            x:3,
            y:357,
            w:292,
            h:83
          }
        },
        {
          id: '7',
          name: '轮胎',
          description: '轮胎',
          image: '/assets/img/ITEMimg/7.jpg',
          style: {
            x:86,
            y:292,
            w:392,
            h:170
          }
        },
      ]
    }
 */
ColouringGame.prototype.changeDraw = async function (backplace) {
  try {
    let {
      id,
      parts
    } = backplace
    let imgsInfo = [];
    let backplaceImgInfo = null
    // 底板
    // let backplace = this.backplace
    let backplaceTaskId = getUUid()
    if (backplace) {
      backplaceImgInfo = {
        id: backplace.id,
        taskId: backplaceTaskId,
        url: backplace.imageUrl
      }
      imgsInfo.push(backplaceImgInfo)
    }
    let partImgsInfo = []
    if (Array.isArray(parts)) {
      // 零件
      partImgsInfo = parts.map((partItem) => {
        return {
          ...partItem,
          id: partItem.id,
          taskId: getUUid(),
          url: partItem.imageUrl
        }
      })
      imgsInfo.push(...partImgsInfo)
    }
    const loadImagesRes = await this.loadAssets({
      imgsInfo,
      onProgress () {
  
      },
      onLoaded () {
  
      },
      onError () {
  
      }
    })
    console.log('changeDraw', {
      loadImagesRes
    });
    // 加载资源成功
    if (loadImagesRes.success) {
      // 开始绘制
      // 在结果中找出底板
      const backplaceAsset = loadImagesRes.data.find((item) => {
        return item.taskId === backplaceTaskId
      })
      
      backplace.image = backplaceAsset.image
      // 格式化零件数据
      let imgAsset = null;
      partImgsInfo.forEach((partItem) => {
        imgAsset = loadImagesRes.data.find((item) => {
          return item.taskId === partItem.taskId
        })
        partItem.image = imgAsset.image;
      })
      // 绘制底板
      // this.drawBackPlace({id, backplace})
      // 创建底板精灵
      this.backplaceSprite = this.createBackPlaceSprite({id, backplace})
      this.children.push(this.backplaceSprite);
      // 绘制零件
      // this.drawParts({parts})
      // 批量创建零件精灵
      this.parts = this.createPartsSprite({parts: partImgsInfo})
      this.parts = canvasUtils.sortNodeByZIndex(this.parts, {
        // 升序
        order: 'asc'
      })
      this.zIndexDescParts = canvasUtils.sortNodeByZIndex(this.parts, {
        // 降序
        order: 'desc'
      })
      this.backplaceSprite.addChilds(this.parts)
      
      console.log('游戏初始化完成', {
        ColouringGame: this,
        gameData: this.gameData
      })
    }
  } catch (error) {
    console.error('切换图片失败', error);
  }
}
// 创建底板精灵
ColouringGame.prototype.createBackPlaceSprite = function ({id, backplace}) {
  let backplaceSprite = null
  try {
    backplaceSprite = this.createSprite({
      x: 0,
      y: 0,
      w: 500,
      h: 500,
      image: backplace.image,
      ...backplace.style
    })
    
    console.log('drawBackPlace', {
      backplaceSprite: this.backplaceSprite
    });
  } catch (error) {
    console.error('绘制底板失败', error);
  }
  return backplaceSprite
}
// 绘制底板
ColouringGame.prototype.drawBackPlace = function ({id, backplace}) {
  try {
    this.backplaceSprite = this.createSprite({
      x: 0,
      y: 0,
      w: 500,
      h: 500,
      image: backplace.image,
      ...backplace.style
    })
    // 把底板加到渲染列表中
    this.children.push(this.backplaceSprite);
    console.log('drawBackPlace', {
      backplaceSprite: this.backplaceSprite
    });
    // 绘制
    this.backplaceSprite.draw();
  } catch (error) {
    console.error('绘制底板失败', error);
  }
}
// 批量创建零件精灵
ColouringGame.prototype.createPartsSprite = function ({parts}) {
  let partSpriteList = []
  try {
    if (!Array.isArray(parts)) {
      return;
    }
    let partSprite = null
    parts.forEach((partItem) => {
      partSprite = this.createPart({
        id: partItem.id,
        name: partItem.name,
        image: partItem.image,
        ...partItem.style,
        zIndex: partItem.zIndex
      })
      partSpriteList.push(partSprite);
      // console.log('drawBackPlace', {
      //   backplaceSprite: this.backplaceSprite
      // });
    })
  } catch (error) {
    console.error('绘制底板失败', error);
  }
  return partSpriteList
}
// 绘制零件
ColouringGame.prototype.drawParts = function ({parts}) {
  try {
    if (!Array.isArray(parts)) {
      return;
    }
    let partSprite = null
    parts.forEach((partItem) => {
      partSprite = this.createPart({
        name: partItem.name,
        image: partItem.image,
        ...partItem.style
      })
      this.parts.push(partSprite);
      // console.log('drawBackPlace', {
      //   backplaceSprite: this.backplaceSprite
      // });
      // 绘制
      partSprite.draw();
    })

    // 零件监听事件
    // this.addEvents();
  } catch (error) {
    console.error('绘制底板失败', error);
  }
}

// 监听事件
ColouringGame.prototype.addEvents = function () {
  // 监听零件点击事件
  // this.parts.forEach((partItem) => {
  //   partItem.on('click', (e) => {
  //     console.log('click partItem', {
  //       e
  //     })
  //   })
  // })
  const self = this;
  this.canvas.addEventListener("click",function(e){
    var event=typeof window.event!="undefined"?window.event:typeof e!="undefined"?e:event;
    var x =event.offsetX;
    var y =event.offsetY;
    var aX=0;
    var aY=0;
    var buf=null;
    // 命中零件按z-index降序查找
    for(var i =0;i<self.zIndexDescParts.length;i++){
        buf=self.zIndexDescParts[i];
        console.log(`零件 ${buf.name}`, {
          x,
          y,
          offsetX: self.offsetX,
          offsetY: self.offsetY,
          scale: self.scale,
          bufx: buf.x,
          bufxstart: buf.x * self.scale + self.offsetX,
          bufxend: buf.x * self.scale + self.offsetX + buf.width * self.scale,
          bufy: buf.y,
          bufystart: buf.y * self.scale + self.offsetY,
          bufyend: buf.y * self.scale + self.offsetY + buf.height * self.scale,
          bufw: buf.width,
          bufh: buf.height,
        });
        if(x>buf.x * self.scale + self.offsetX
          && x<buf.x * self.scale + self.offsetX + buf.width * self.scale
          && y>buf.y * self.scale + self.offsetY
          && y<buf.y * self.scale + self.offsetY + buf.height * self.scale){
            console.log(`命中了零件 ${buf.name}`, buf);
            // if(buf.image){
            //     aX=x-buf.x;
            //     aY=y-buf.y;
            //     if(dataInfo(buf,aX,aY)>80){
            //         buf.emit('click')
            //     };
            // }else{
            //     buf.emit('click')
            // }
            buf.emit('click')
            break
        }
    }
  });
  // 平移
  this.isMoving = false;
  // 鼠标移动前的坐标
  this.mouseLocation = {
    x: 0,
    y: 0
  }
  // 触摸点1
  let touch1 = null
  let touch2 = null
  // 两个触摸点的距离
  let distanceBetweenTwoTouchPoints = 0;
  // 触摸点2
  this.canvas.addEventListener("touchstart", function (e) {
    var event=typeof window.event!="undefined"?window.event:typeof e!="undefined"?e:event;
    self.isMoving = true;
    // 记录鼠标位置
    self.mouseLocation.x = event.touches[0].clientX;
    self.mouseLocation.y = event.touches[0].clientY;

    if (event.touches.length === 2) {
      distanceBetweenTwoTouchPoints = canvasUtils.getDistance(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY)
      if (this.debug) {
        this.debug.prevDistance = distanceBetweenTwoTouchPoints
        this.debug.currentDistance = distanceBetweenTwoTouchPoints
      }
    }
  })
  this.canvas.addEventListener("touchmove", function (e) {
    var event=typeof window.event!="undefined"?window.event:typeof e!="undefined"?e:event;
    // 判断如果是一个触摸点，则为移动，两个触摸点则为缩放
    if (event.touches.length === 1) {
      let x =event.touches[0].clientX;
      let y =event.touches[0].clientY;
      self.mousePos = {
        x,
        y
      }
      // 计算鼠标偏移
      // var offsetX = x - self.mouseLocation.x;
      // var offsetY = y - self.mouseLocation.y;
      // console.log('鼠标偏移', {
      //   offsetX,
      //   offsetY,
      //   mouseLocation: self.mouseLocation,
      //   x,
      //   y
      // })
      // 设置画布平移
      // self.moveCamera(offsetX, offsetY)
      self.offsetX = self.curOffset.x + (x - self.mouseLocation.x)
      self.offsetY = self.curOffset.y + (y - self.mouseLocation.y)

      
      if (self.debug) {
        self.debug.currentDistance = 100
      }
    } else if (event.touches.length === 2) {
      // 得到
      let currentDistanceBetweenTwoTouchPoints = canvasUtils.getDistance(event.touches[0].clientX, event.touches[0].clientY, event.touches[1].clientX, event.touches[1].clientY)
      if (self.debug) {
        self.debug.currentDistance = currentDistanceBetweenTwoTouchPoints
      }
      if (currentDistanceBetweenTwoTouchPoints > distanceBetweenTwoTouchPoints) {
        // 如果距离变大，则为放大画布
        self.zoomIn()
      } else if (currentDistanceBetweenTwoTouchPoints < distanceBetweenTwoTouchPoints) {
        // 距离变小，则为缩小画布
        self.zoomOut()
      }
      distanceBetweenTwoTouchPoints = currentDistanceBetweenTwoTouchPoints
      if (self.debug) {
        self.debug.prevDistance = currentDistanceBetweenTwoTouchPoints
      }
    }
    
    console.log('鼠标开始移动', {
      x: self.mouseLocation.x,
      y: self.mouseLocation.y
    });
  })
  this.canvas.addEventListener("touchend", function (e) {
    self.isMoving = false;
    self.mouseLocation.x = 0;
    self.mouseLocation.y = 0;
    touch1 = null;
    touch2 = null;
    self.curOffset = {
      x: self.offsetX,
      y: self.offsetY
    }
  })
  // 监听缩放
  this.canvas.addEventListener("wheel", function (e) {
    console.log('鼠标滚动', e);

    const deltaY = e.deltaY;
    self.mousePos = {
      x: e.offsetX,
      y: e.offsetY
    }
    if (deltaY < 0) {
      self.zoomIn()
    } else {
      self.zoomOut()
    }
  })
}

function dataInfo(Obj,x,y){
  var c=document.createElement("canvas");
  var txt= c.getContext("2d");
  c.width=Obj.image.width;
  c.height=Obj.image.height;
  txt.drawImage(Obj.image,0,0);
  var data=txt.getImageData(x-1,y-1,3,3);
  var num=0;
  for(var q=0;q<data.data.length;q+=4){
      num+=data.data[q+3];
  }
  num=num/9;
  return parseInt(num);
}
ColouringGame.prototype.changeCurrentPartColor = function ({color}) {
  if (!color || !this.currentSelectedPart) {
    return;
  }
  this.currentSelectedPart.changeColor({
    color
  });
  // 判断当前所有的零件是不是都上完色了，并抛出事件
  if (this.isAllPartsPainted()) {
    // this.emit('allPartsPainted');
    if (typeof this.onAllPartsPainted === 'function') {
      this.onAllPartsPainted();
    }
  }
}



/**
 * 初始化颜料盘
 */
ColouringGame.prototype.initPalette = function ({
  palette
}) {
  this.palette.addColors({
    colors: palette.colors
  });
}

/**
 * 单独展示border
 */
ColouringGame.prototype.showPartBorder = function (part) {
  const imageDataManager = part.imageDataManager
  const borderPixels = part.border.borderPixels
  if (!borderPixels) {
    return;
  }
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  canvas.width = part.width
  canvas.height = part.height

  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  let index = 0
  borderPixels.forEach((borderPixel) => {
    index = borderPixel.y * part.width * 4 + borderPixel.x * 4
    imgData.data[index] = borderPixel.r
    imgData.data[index + 1] = borderPixel.g
    imgData.data[index + 2] = borderPixel.b
    imgData.data[index + 3] = borderPixel.a
  })

  ctx.putImageData(imgData, 0, 0)

  return canvas
}

/**
 * 资源管理器
 * 加载图片，给图片指定唯一标识，查找获取图片
 * 创建图片对象Image
 */
class AssetsManager {
  constructor() {
    this.imageList = []
    this.imageMap = {}
    this.assets = []
    this.assetsMap = {}
    this.taskListCollection = []
    this.taskListMap = {}
  }

  async loadImage ({id, url}) {
    let imgAsset = new ImageAsset({id, url})
    let task = new Task({
      data: imgAsset,
      excutionFunc: imgAsset.load.bind(imgAsset)
    })
    this.imageList.push(imgAsset)
    this.imageMap[id] = imgAsset
    imgAsset.task = task; // 索引任务对象，方便查看任务执行情况
    try {
      const taskRes = await task.do();
    } catch (error) {
      
    }
    return imgAsset;
  }
  /**
   * imgsInfo
   * [
   *  {
   *    id: 'xxx',
   *    url: ''
   *  }
   * ]
   * @param {*} param0 
   */
  async loadImages ({imgsInfo, onProgress, onLoaded, onError}) {
    let res = {
      success: false,
      data: null,
      error: null,
      msg: ''
    }
    let taskList = new TaskList()
    this.taskListCollection.push(taskList)
    this.taskListMap[taskList.id] = taskList
    let taskListRes = null;

    let imgAsset = null
    let task = null
    if (Array.isArray(imgsInfo)) {
      imgsInfo.forEach(item => {
        imgAsset = new ImageAsset({id: item.id,taskId: item.taskId, url: item.url})
        task = new Task({
          id: item.taskId,
          data: imgAsset,
          excutionFunc: imgAsset.load.bind(imgAsset)
        })
        taskList.addTask(task);
        // imgAsset.task = task // 索引任务对象，方便查看任务执行情况
        this.imageList.push(imgAsset)
        this.imageMap[item.id] = imgAsset
      })
      
      taskListRes = await taskList.doTasks()
      if (taskListRes.success) {
        res = {
          success: true,
          data: this.imageList,
          error: null,
          msg: '加载图片成功'
        }
      } else {
        res = {
          success: false,
          data: null,
          error: taskListRes.error,
          msg: '加载图片失败'
        }
      }
    }
    return res;
  }
}

/**
 * 图片资源
 */
class ImageAsset {
  // 类型常量image
  static get type() {
    return 'image'
  }
  constructor({id, taskId, url}) {
    this.id = id
    this.taskId = taskId
    this.url = url
    this.image = null // 图片对象 Image
    this.task = null;
    this.imageError = null;
    this.loading = false
    this.loaded = false;
  }
  load() {
    return new Promise((resolve, reject) => {
      let res = {
        success: false,
        data: null,
        error: null,
        msg: ''
      }
      this.loading = true
      this.image = new Image()
      this.image.crossOrigin = "Anonymous"
      this.image.src = this.url
      this.image.onload = () => {
        this.loading = false
        this.loaded = true
        res = {
          success: true,
          data: this.image,
          msg: '图片加载成功'
        }
        resolve(res)
      }
      this.image.onerror = (error) => {
        this.loading = false
        this.loaded = false
        this.imageError = error;
        res = {
          success: false,
          error: this.imageError,
          msg: '图片加载失败'
        }
        resolve(res)
      }
    })
  }
}

/**
 * 任务对象
 * id 任务id，唯一标识和查找
 * type 任务类型 用于区分任务类型
 * status 状态
 *  init 初始化
 *  doing 进行中
 *  done 完成
 *  failed 失败
 */
class Task {
  constructor({id, name, type, data, excutionFunc, successCallback, failCallback}) {
    this.id = id || getUUid()
    this.name = this.name
    this.status = 'init'
    this.data = data; // 任务数据 自定义
    this.excutionRes = null // 任务执行结果对象
    this.excutionError = null // 任务执行失败对象
    this.taskRes = null // 任务结果
    this.type = type
    this.excutionFunc = excutionFunc
    this.successCallback = successCallback
  }
  async do () {
    let res = {
      success: false,
      data: null,
      excutionRes: null,
      error: null,
      excutionError: null,
      msg: ''
    }
    this.status = 'doing'
    if (typeof(this.excutionFunc) === 'function') {
      try {
        this.excutionRes = await this.excutionFunc()
        if (this.excutionRes.success) {
          res = {
            success: true,
            data: this.excutionRes,
            msg: this.excutionRes.msg || '任务成功',
          }
          this.status = 'done'
          this.taskRes = res
          this.successCallback(res)
        } else {
          res = {
            success: false,
            error: this.excutionRes.error,
            msg: this.excutionRes.msg || '任务失败'
          }
          this.status = 'failed'
          this.failCallback(res)
        }
      } catch (error) {
        res = {
          success: false,
          error,
          msg: error.message || error.msg || '任务失败'
        }
        this.excutionError = error;
        this.status = 'failed'
      }

    } else {
      this.status = 'done'
      // 没有执行函数，相当于直接成功
      res = {
        success: true,
        data: null,
        msg: '任务成功'
      }
    }

    return res;
  }
  // 是否正在执行任务
  isDoing () {
    return !!(this.status === 'doing')
  }
  // 是否是完成状态
  isDone () {
    return !!(this.status === 'done')
  }
}
/**
 * 任务列表
 */
class TaskList {
  constructor({id, tasks} = {}) {
    this.id = id || getUUid() // 任务列表id，便于查询
    this.tasks = tasks || []// 任务列表
    this.tasksCount = 0 // 任务总数
    this.tasksMap = {} // 任务字典，便于查询
    this.successList = [] // 成功列表
    this.successCount = 0 // 成功数量
    this.failedList = [] // 失败列表
    this.failedCount = 0 // 失败数量

    this.tasksPromiseList = [] // 任务执行承诺列表
    this.tasksAllEndPromise = null // 所有任务执行完成的承诺
    this.tasksResList = [] // 任务执行结果列表

    this.status = 'init' // doing(执行中) allSuccess(执行完成且都成功) allFailed(执行完成且都失败) partSuccess(部分成功)
  }
  // 执行中
  get isDoing () {
    return this.status === 'doing'
  }
  // allSuccess(执行完成且都成功)
  get isAllSuccess () {
    return this.status === 'allSuccess'
  }
  // allFailed
  get isAllFailed () {
    return this.status === 'allFailed'
  }
  // 是否部分成功，部分失败
  get isPartSuccess () {
    return this.status === 'partSuccess'
  }
  // 执行结束，但可能是allSuccess || allFailed || partSuccess
  get isAllEnded() {
    return this.isAllSuccess || this.isAllFailed || this.isPartSuccess
  }
  // 追加任务
  addTask (task) {
    if (!Array.isArray(this.tasks)) {
      this.tasks = []
    }
    this.tasks.push(task)
  }
  // 更新任务列表信息
  updateStatus () {
    if (Array.isArray(this.tasks)) {
      this.tasksCount = this.tasks.length
      this.tasksMap = {}
      this.tasks.forEach(task => {
        this.tasksMap[task.id] = task
      })
    }
    if (Array.isArray(this.successList)) {
      this.successCount = this.successList.length
    }
    if (Array.isArray(this.failedList)) {
      this.failedCount = this.failedList.length
    }
    if (this.successCount + this.failedCount >= this.tasksCount) {
      if (this.successCount === this.tasksCount) {
        this.status = 'allSuccess'
      } else if (this.failedCount === this.tasksCount) {
        this.status = 'allFailed'
      } else {
        this.status = 'partSuccess'
      }
    }
  }

  // 批量执行任务
  async doTasks () {
    let res = {
      success: true,
      data: null,
      msg: '任务列表为空'
    }

    if (!this.isDoing) {
      if (Array.isArray(this.tasks)) {
        let taskPromise = null
        this.tasks.forEach(task => {
          taskPromise = task.do()
          taskPromise.then((res) => {
            if (res.success) {
              this.successList.push(task)
            } else {
              this.failedList.push(task)
            }
            this.updateStatus();
          })
          this.tasksPromiseList.push(taskPromise);
        })
      }
      if (Array.isArray(this.tasksPromiseList) && this.tasksPromiseList.length > 0) {
        this.tasksAllEndPromise = Promise.all(this.tasksPromiseList)
      }
    }
    
    if (this.tasksAllEndPromise) {
      try {
        this.taskResList = await this.tasksAllEndPromise
        res = {
          success: true,
          data: {
            status: this.status,
            taskResList: this.tasksResList,
            successList: this.successList,
            failedList: this.failedList
          },
          msg: '任务执行成功'
        }
      } catch (error) {
        res = {
          success: false,
          data: null,
          msg: error.message || error.msg || '任务执行失败'
        }
      }

    }
    return res
  }

}


/**
 * 资源对象
 */
// class Asset {
//   constructor({id, url}
// }


// 事件
class Events {
  constructor() {
    this.events = {
      'click': [],
      // 'mouseover': [],
      // 'mouseout': [],
      // 'mousemove': [],
      // 'mouseup': [],
      // 'mousedown': [],
      // 'keydown': [],
      // 'keyup': [],
      // 'keypress': [],
      // 'resize': [],
      // 'scroll': [],
      // 'touchstart': [],
      // 'touchmove': [],
      // 'touchend': [],
      // 'touchcancel': [],
      // 'wheel': [],
      // 'blur': [],
      // 'focus': [],
      // 'change': [],
    }
  }
  on(eventName, callback) {
    this.events[eventName].push(callback)
  }
  emit(eventName, ...args) {
    const eventFuncionList = this.events[eventName]
    if (Array.isArray(eventFuncionList)) {
      eventFuncionList.forEach(eventFuncion => {
        eventFuncion(...args)
      })
    }
  }
  off(eventName, callback) {
    const eventFuncionList = this.events[eventName]
    if (Array.isArray(eventFuncionList)) {
      eventFuncionList.forEach((eventFuncion, index) => {
        if (eventFuncion === callback) {
          eventFuncionList.splice(index, 1)
        }
      })
    }
  }
}

// 节点
class Node {
  constructor (options) {
    this.events = new Events()
    this.onClick = options.onClick
    this.id = options.id || getUUid();
    this.name = options.name || ''
    this.x = options.x
    this.y = options.y
    this.width = options.w
    this.height = options.h
    this.zIndex = options.zIndex || 0
    this.parent = options.parent || null
    this.children = options.children || []
    this.context = options.context
    this.children = []
    // this.addEvents()
  }
  on(eventName, callback) {
    this.events.on(eventName, callback)
  }
  off(eventName, callback) {
    this.events.off(eventName, callback)
  }
  emit(eventName, ...args) {
    this.events.emit(eventName, ...args)
  }

  addChild (node) {
    this.children.push(node)
    node.parent = this
    this.sortByZIndex()
  }
  addChilds (nodes) {
    if (Array.isArray(nodes)) {
      nodes.forEach(node => {
        node.parent = this
      })
    }
    this.children.push(...nodes)
    this.sortByZIndex()
  }
  sortByZIndex () {
    this.children = canvasUtils.sortNodeByZIndex(this.children)
  }
  // addEvents () {
  //   if (this.onClick) {
  //     this.on('click', this.onClick.bind(this))
  //   }
  // }
}


// 精灵
class Sprite extends Node {
  constructor(options) {
    super(options)
    this.id = options.id
    this.x = options.x
    this.y = options.y
    this.width = options.w
    this.height = options.h
    this.originImage = options.image
    this.image = options.image
    this.context = options.context
    this.onClick = options.onClick
  }
  draw() {
    this.context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}

// 像素点
class Pixel {
  constructor (options) {
    this.x = options.x;
    this.y = options.y;
    // this.rgba = options.rgba;
    // this.r = options.r;
    // this.g = options.g;
    // this.b = options.b;
    // this.a = options.a;
    this.color = {}
    this.init(options);
  }
  // 是不是透明
  get isTransparent () {
    let flag = false;
    if (this.color) {
      flag = this.color.isTransparent()
    }
    return flag
  }
  get r () {
    return this.color.r
  }
  get g () {
    return this.color.g
  }
  get b () {
    return this.color.b
  }
  get a () {
    return this.color.a
  }
  init ({r,g,b,a,hex,opacity}) {
    this.color = new Color({
      r,
      g,
      b,
      a
    })
  }
  // 改变像素颜色
  changeColor ({r,g,b,a,hex,opacity}) {
    if (!this.color) {
      this.color = new Color({r,g,b,a,hex,opacity})
    }
    this.color.changeColor({r,g,b,a,hex,opacity})
  }

  // 判断两个点是不是同一个
  isSameLocation (pixel) {
    return this.isSameLocationBetweenPixels(this, pixel);
  }

  // 计算两个像素之间的距离
  getDistance (pixel) {
    return this.getDistanceBetweenTwoPixels(this, pixel)
  }
  static isSameLocationBetweenPixels (a, b) {
    let flag = false
    if (a && b) {
      if (a === b) {
        flag = true
      } else {
        const distance = Pixel.getDistanceBetweenTwoPixels(a, b)
        flag = distance === 0
      }

    }
    return flag
  }
  static getDistanceBetweenTwoPixels (a,b) {
    let distance = 0;
    const x = a.x - b.x
    const y = a.y - b.y
    distance = Math.sqrt(x * x + y * y)
    return distance 
  }

}
class ImageDataManager {
  constructor (options) {
    this.imageData = options.imageData
    this.width = options.width
    this.height = options.height
    this.uint8ClampedArray = this.imageData.data
    this.pixels = null // 二维数组 第一维是横坐标 第二维是纵坐标
    this.pixelCount = 0
    this.pixelIndex = 0
    this.createPixelArr = []
    this.borderPixels = []
    this.init()
  }
  init () {
    this.pixelIndex = 0
    // 生成像素点数组
    this.pixels = this.initPixel()
    this.pixelCount = this.pixels.length / 4
    // this.initBorder()
  }
  // 初始化内边框
  initBorder () {
    // 获取边框像素数组
    this.borderPixels = this.getBorderPixels()
    // 获取边框图像

    const imageDataManager = part.imageDataManager
    const borderPixels = imageDataManager.borderPixels
    if (!borderPixels) {
      return;
    }
    this.borderCanvas = document.createElement('canvas')
    ctx = canvas.getContext('2d')
    canvas.width = part.width
    canvas.height = part.height

    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    let index = 0
    borderPixels.forEach((borderPixel) => {
      index = borderPixel.y * part.width * 4 + borderPixel.x * 4
      imgData.data[index] = borderPixel.r
      imgData.data[index + 1] = borderPixel.g
      imgData.data[index + 2] = borderPixel.b
      imgData.data[index + 3] = borderPixel.a
    })

    ctx.putImageData(imgData, 0, 0)

    return canvas

  }

  // 生成像素点数组
  initPixel () {
    let pixels = []
    const uint8ClampedArray = this.uint8ClampedArray
    if (Object.prototype.toString.call(uint8ClampedArray) === '[object Uint8ClampedArray]') {
      let y = 0
      let x = 0
      let pixelIndex = 0
      let pixel = null
      for(let q = 0; q < uint8ClampedArray.length; q += 4) {
        // 算出当前横坐标
        pixelIndex = q / 4
        x = pixelIndex % this.width
        y = Math.floor(pixelIndex / this.width)
        pixel = new Pixel({
          x,
          y,
          r: uint8ClampedArray[q],
          g: uint8ClampedArray[q + 1],
          b: uint8ClampedArray[q + 2],
          a: uint8ClampedArray[q + 3]
        })
        if (!Array.isArray(pixels[y])) {
          pixels[y] = []
        }
        pixels[y][x] = pixel
      }
    }
    return pixels
  }
  // 遍历像素数组
  forEachPixel (fn) {
    let pixelIndex = 0
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        pixelIndex++
        fn(this.pixels[y][x], pixelIndex, this)
      }
    }
    return this
  }
  // 判断某一个像素是否紧挨着透明像素
  isAdjacentTransparent (pixel) {
    let pixelAbove = this.getPixel(pixel.x, pixel.y - 1)
    let pixelBelow = this.getPixel(pixel.x, pixel.y + 1)
    let pixelLeft = this.getPixel(pixel.x - 1, pixel.y)
    let pixelRight = this.getPixel(pixel.x + 1, pixel.y)
    return pixelAbove && pixelAbove.isTransparent ||
      pixelBelow && pixelBelow.isTransparent ||
      pixelLeft && pixelLeft.isTransparent ||
      pixelRight && pixelRight.isTransparent
  }
  getPixel (x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null
    }
    return this.pixels[y][x]
  }

  // 获取边框像素集合
  getBorderPixels () {
    let borderPixels = []
    this.forEachPixel((pixel, pixelIndex) => {
      // console.log({
      //   pixel,
      //   color: pixel.color,
      //   a: pixel.color.a,
      //   isTransparent: pixel.isTransparent,
      // });
      // 一个非透明的像素点周围有透明像素点，我们认为是边框
      
      if (this.isBorderPixel(pixel)) {
        borderPixels.push(pixel)
      }
    })
    // console.log('边框像素集合', borderPixels);
    return borderPixels
  }

  // 判断是否是边缘节点
  isBorderPixel (pixel) {
    let flag = false;
    // 自身不透明 且 (挨着透明节点 或 当前节点在最边上）
    if (!pixel.isTransparent && (this.isAdjacentTransparent(pixel) || this.isContainerBorderPixel(pixel))) {
      flag = true
    }
    return flag

  }
  // 判断某个像素是不是在容器最边上
  isContainerBorderPixel (pixel) {
    let flag = false;
    if (pixel.x === 0 || pixel.x >= this.width - 1 || pixel.y === 0 || pixel.y >= this.height - 1) {
      flag = true
    }
    return flag
  }

  /**
   * 根据边框的像素点，画一条线
   */
  // getBorderLines () {
  //   let borderLines = []

  //   let canvas = document.createElement('canvas');
  //   let ctx = canvas.getContext('2d');  
  //   // 给边框像素排序，按最近的排
  //   let linePixels = []
  //   let line = null
  //   let startPixel = this.borderPixels[0]
  //   this.getNearestPixel(startPixel, );
  //   let line
  // }

  /**
   * 找出一条完整的边
   */
  getCompleteBorderLinePixels (startPixel, borderPixels) {
    let linePixels = []
    let nearestPixel = null
    if (startPixel) {
      linePixels.push(startPixel)
      if (Array.isArray(borderPixels)) {
        nearestPixel = this.getNearestPixel(startPixel, borderPixels)
      }
    }
  }
  

  /**
   * 找出某个像素点最近的像素点
   */
  getNearestPixel (referPixel, pixelArr) {
    let nearestPixel = null
    let minDistance = null
    let distance = null
    pixelArr.forEach((pixel) => {
      distance = Pixel.getDistanceBetweenTwoPixels(referPixel, pixel)
      if (!minDistance) {
        minDistance = distance
      }
      if (distance < minDistance) {
        minDistance = distance
        nearestPixel = pixel
      }
    })
    return nearestPixel
  }

  /**
   * 获取一个像素周围九宫格
   */
  getPixelNeighbors (pixel) {
    let neighbors = []
    let pixelAbove = this.getPixel(pixel.x, pixel.y - 1)
    let pixelBelow = this.getPixel(pixel.x, pixel.y + 1)
    let pixelLeft = this.getPixel(pixel.x - 1, pixel.y)
    let pixelRight = this.getPixel(pixel.x + 1, pixel.y)
    if (pixelAbove) {
      neighbors.push(pixelAbove)
    }
    if (pixelBelow) {
      neighbors.push(pixelBelow)
    }
    if (pixelLeft) {
      neighbors.push(pixelLeft)
    }
    if (pixelRight) {
      neighbors.push(pixelRight)
    }
    return neighbors
  }

  static getPixelByPixelArr ({x, y, pixelArr}) {
    
  }



  /**
   * 给边框上色
   * @param {*} color hex
   */
  colorizeBorder ({color}) {
    this.borderPixels.forEach((borderPixel) => {
      borderPixel.changeColor({
        hex: color
      })
    })
  }

  /**
   * 获取当前点阵数组
   */
  getImageData () {
    const self = this;
    let uint8ClampedArray = this.uint8ClampedArray
    let pixels = this.pixels
    let x = 0
    let y = 0
    let unitIndex = 0;
    let xPixelArr = []
    let pixel = null
    for (y = 0; y < self.height; y++) {
      xPixelArr = pixels[y]
      for (x = 0; x < self.width; x++) {
        pixel = xPixelArr[x]
        unitIndex = y * self.width * 4 + x * 4
        uint8ClampedArray[unitIndex] = pixel.r
        uint8ClampedArray[unitIndex + 1] = pixel.g
        uint8ClampedArray[unitIndex + 2] = pixel.b
        uint8ClampedArray[unitIndex + 3] = pixel.a
      }
    }
    return this.imageData
  }

}
// 零件
class Part extends Sprite {
  constructor(options) {
    super(options)
    this.id = options.id || getUUid()
    this.image = options.image
    // this.width = options.width
    // this.height = options.height
    this.fillColor = null
    this.selectedBorderColor = options.selectedBorderColor || '#000000'
    this.isSelected = false
    this.painted = false
    this.init()
    this.addEvents()
  }
  init () {
    if (!this.image) {
      return
    }
    const img = this.image
    const c=document.createElement("canvas");
    const txt= c.getContext("2d");
    c.width=img.width;
    c.height=img.height;
    txt.drawImage(img,0,0);
    // 获取图像点阵
    let imageData = txt.getImageData(0, 0, c.width, c.height)
    // 创建图像点阵管理器
    // this.imageDataManager = new ImageDataManager({
    //   imageData: imageData,
    //   width: imageData.width,
    //   height: imageData.height,
    //   // initBorderPixels: true
    // })
    // 初始化边框
    // this.initBorder()
  }
  initBorder () {
    // 获取边框像素数组
    const borderPixels = this.imageDataManager.getBorderPixels()
    this.border = new Border({
      width: this.width,
      height: this.height,
      borderPixels
    })

  }
  draw () {
    // 画一条虚线，用来示意选中
    if (this.isSelected) {
      this.lineDash()
    }
    super.draw()
  }
  // 给图片加上虚线边框
  lineDash () {
    if (!this.image) {
      return
    }
    const img = this.image
    const c=document.createElement("canvas");
    const txt= c.getContext("2d");
    c.width=img.width;
    c.height=img.height;
    txt.drawImage(img,0,0);
    // 获取图像点阵
    let imageData = txt.getImageData(0, 0, c.width, c.height)
    // 创建图像点阵管理器
    this.imageDataManager = new ImageDataManager({
      imageData: imageData,
      width: imageData.width,
      height: imageData.height
    })

    this.imageDataManager.colorizeBorder({
      color: this.selectedBorderColor
    });

    // 获取当前图片点阵
    let newImageData = this.imageDataManager.getImageData()
    
    txt.putImageData(newImageData,0,0)

    this.image = c
  }

  // 选中，然后可以填充颜色
  select () {
    this.isSelected = true
    this.draw()
  }
  // 改变颜色
  changeColor ({color}) {
    this.fillColor = color;
    this.image = this.changeImageColor({
      color: this.fillColor
    })
    this.draw();
    this.painted = true
  }
  /*创建img数据*/
  changeImageColor ({color}) {
    if (!this.image || !color) {
      return
    }
    const img = this.image
    var c=document.createElement("canvas");
    var txt= c.getContext("2d");
    c.width=img.width;
    c.height=img.height;
    txt.drawImage(img,0,0);
    var data=txt.getImageData(0,0, c.width, c.height);
    for(var q=0;q<data.data.length;q+=4){
      if(data.data[q+3]>100){
        data.data[q]=color.r;
        data.data[q+1]=color.g;
        data.data[q+2]=color.b;
      }
      // data.data[q]=color.r;
      // data.data[q+1]=color.g;
      // data.data[q+2]=color.b;
    }
    txt.putImageData(data,0,0);
    return c;
  }
  // 添加事件
  addEvents () {
    if (this.onClick) {
      this.on('click', this.onClick.bind(this))
    }
  }
}

class Border {
  constructor (options) {
    this.options = options
    this.width = options.width
    this.height = options.height
    this.color = null
    this.borderPixels = options.borderPixels || []
    this.canvas = null
    this.ctx = null
    this.imageData = null
    this.init()
  }
  init () {
    const borderPixels = this.borderPixels
    // 获取边框图像
    if (!borderPixels) {
      return;
    }
    this.borderCanvas = document.createElement('canvas')
    this.ctx = this.borderCanvas.getContext('2d')
    this.borderCanvas.width = this.width
    this.borderCanvas.height = this.height

    this.imageData = this.ctx.getImageData(0, 0, this.borderCanvas.width, this.borderCanvas.height)

    let index = 0
    borderPixels.forEach((borderPixel) => {
      index = borderPixel.y * this.width * 4 + borderPixel.x * 4
      this.imageData.data[index] = borderPixel.r
      this.imageData.data[index + 1] = borderPixel.g
      this.imageData.data[index + 2] = borderPixel.b
      this.imageData.data[index + 3] = borderPixel.a
    })

    this.ctx.putImageData(this.imageData, 0, 0)

    this.imageDataManager = new ImageDataManager({
      imageData: this.imageData,
      width: this.imageData.width,
      height: this.imageData.height,
    })

    // TODO 处理边框像素集合，最终得到一个或多个可连线的边框像素集合
  }
  changeColor(color) {
    this.canvas = this.imageDataManager.changeColor({
      color
    })
  }
  draw () {
    this.ctx.putImageData(this.imageData, 0, 0)
  }
}

// 颜色
class Color {
  constructor ({hex, opacity, r, g, b, a}) {
    this.hex = hex
    this.opacity = isNaN(parseFloat(opacity)) ? 1 : opacity 
    this.r = r
    this.g = g
    this.b = b
    this.a = a
    this.init()
  }
  // 获取rgba
  get rgba () {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`
  }
  init () {
    let {hex, opacity, r, g, b, a} = this
    // 如果有16进制，则算出rgb
    this.changeColor({hex, opacity, r, g, b, a})
  }
  // 是不是透明
  isTransparent () {
    return this.a === 0
  }
  // 改变颜色
  changeColor ({hex, opacity, r, g, b, a}) {
    if (hex) {
      this.hex = hex
      this.r = hexToDec(hex.substr(1, 2));
      this.g = hexToDec(hex.substr(3, 2));
      this.b = hexToDec(hex.substr(5, 2));
      this.a = typeof opacity === 'number' ? Math.floor(opacity * 255) : 255
    } else if (typeof r === 'number'
      && typeof g === 'number'
      && typeof b === 'number') {
        this.r = r
        this.g = g
        this.b = b
        this.a = typeof a === 'number' ? a : 255
        // 如果有rgb，则算出16进制
        this.hex = '#' + decToHex(r) + decToHex(g) + decToHex(b);
        this.opacity = typeof a === 'number' ? Math.floor(a / 255) : 1
    }
  }
  
}
// 16进制转10进制
function hexToDec (hex) {
  return parseInt(hex, 16)
}
// 10进制转16进制
function decToHex (dec) {
  return dec.toString(16)
}

// 颜料盘
class Palette {
  constructor ({colors = []} = {}) {
    this.colors = colors
    this.colorObjList = []
    this.init()
  }
  init () {
    this.addColors({color: this.colors});
  }
  addColors ({colors}) {
    if (!Array.isArray(colors)) {
      return;
    }
    this.colors = [
      ...colors
    ]
    let colorObj = null
    let bgColorObj = null
    const newColorObjList = this.colors.map(colorItem => {
      if (typeof colorItem ==='string') {
        colorObj = this.createColorObj(colorItem)
      } else if (typeof colorItem === 'object') {
        colorObj = this.createColorObj(colorItem.color)
        bgColorObj = this.createColorObj(colorItem.bgColor)
      }
      return {
        color: colorObj,
        bgColor: bgColorObj
      }
    })
    this.colorObjList = [
      ...newColorObjList
    ]
  }
  createColorObj (color) {
    let colorObj = null
    if (typeof color === 'string') {
      colorObj = new Color({hex: color})
    } else if (typeof color === 'object') {
      if (color.type === 'hex') {
        colorObj = new Color({hex: color.hex, opacity: color.opacity})
      } else if (color.type === 'rgb'){
        colorObj = new Color({r: color.r, g: color.g, b: color.b})
      } else {
        // 其他颜色类型
        colorObj = new Color(color)
      }
    }
    return colorObj
  }
}

// 笔
class Pen {
  constructor({color = null} = {}) {
    this.color = color
  }
  // 改变笔的颜色
  changeColor (color) {
    this.color = color
  }
  // 给某个东西上色
  draw (options) {
    if (!this.color) {
      return;
    }

  }
}

function getUUid () {
  let d = Date.now();
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
// 工具
const canvasUtils = {
  // 按y轴层级升序排序
  sortNodeByZIndex (arr = [], {order='asc'} = {}) {
    if (!Array.isArray(arr)) {
      return []
    }
    return arr.sort((a, b) => {
      if (order === 'asc') {
        return a.zIndex - b.zIndex
      } else if (order === 'desc') {
        return b.zIndex - a.zIndex
      }
      return a.zIndex - b.zIndex
    })
  },
  // 计算两个坐标的距离
  getDistance (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  },
  // 计算两个坐标的角度
  getAngle (x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI
  }
}
export default ColouringGame