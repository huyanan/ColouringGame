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
  init ({container, width, height}) {
    // 创建画布
    this.canvas = this.createCanvas(width, height)
    // canvas2d context
    this.context = this.canvas.getContext('2d')
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
        colors,
        colouringGameDataList
      } = gameData
      this.gameData = gameData;
      // 默认选中第一张图
      if (Array.isArray(colouringGameDataList) && colouringGameDataList.length > 0) {
        this.changeDraw(colouringGameDataList[0])
      }

      // 初始化颜料盘
      this.initPalette({
        colors
      });
    } catch (error) {
      console.error('游戏初始化失败', error)
    }
  }

  // 重绘
  render () {

  }
}




// 创建画布
ColouringGame.prototype.createCanvas = function(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
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
ColouringGame.prototype.createPart = function ({name, x, y, w, h, image}) {
  const self = this
  const part = new Part({
    name,
    x,
    y,
    w,
    h,
    image,
    context: this.context,
    onClick () {
      console.log('当点击零件', {
        part
      });
      self.currentSelectedPart = part
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
ColouringGame.prototype.changeDraw = async function (drawData) {
  try {
    let {
      id,
      backplace,
      parts
    } = drawData
    let imgsInfo = [];
    // 底板
    if (backplace) {
      imgsInfo.push({
        id: backplace.id,
        url: backplace.image
      })
    }
    if (Array.isArray(parts)) {
      // 零件
      imgsInfo.push(...parts.map((partItem) => {
        return {
          id: partItem.id,
          url: partItem.image
        }
      }))
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
        return item.id === backplace.id
      })
      backplace.image = backplaceAsset.image
      // 格式化零件数据
      let imgAsset = null;
      parts.forEach((partItem) => {
        imgAsset = loadImagesRes.data.find((item) => {
          return item.id === partItem.id
        })
        partItem.image = imgAsset.image;
      })
      // 绘制底板
      this.drawBackPlace({id, backplace})
      // 绘制零件
      this.drawParts({parts})
      // 
    }
  } catch (error) {
    console.error('切换图片失败', error);
  }
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
    console.log('drawBackPlace', {
      backplaceSprite: this.backplaceSprite
    });
    // 绘制
    this.backplaceSprite.draw();
  } catch (error) {
    console.error('绘制底板失败', error);
  }
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
    for(var i =0;i<self.parts.length;i++){
        buf=self.parts[i];
        console.log('查找点击的零件', {
          x,
          y,
          bufx: buf.x,
          bufy: buf.y,
          bufw: buf.width,
          bufh: buf.height,
        });
        if(x>buf.x&&x<buf.x+buf.width&&y>buf.y&&y<buf.y+buf.height){
            if(buf.image){
                aX=x-buf.x;
                aY=y-buf.y;
                if(dataInfo(buf,aX,aY)>80){
                    buf.emit('click')
                };
            }else{
                buf.emit('click')
            }
        }
    }
  });
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
ColouringGame.prototype.draw = function () {

}
ColouringGame.prototype.changeCurrentPartColor = function ({color}) {
  if (!color || !this.currentSelectedPart) {
    return;
  }
  this.currentSelectedPart.changeColor({
    color
  });
}



/**
 * 初始化颜料盘
 */
ColouringGame.prototype.initPalette = function ({
  colors
}) {
  this.palette.addColors({
    colors
  });
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
  // loadAssets (assetsInfoList) {
  //   return new Promise((resolve, reject) => {
  //     this.assets = assetsInfoList
  //     this.assets.forEach(item => {
  //       let task = this.createTask(item)
  //       this.taskListCollection.push(task)
  //       this.taskListMap[item.id] = task
  //     })
  //   }
  // }
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
        imgAsset = new ImageAsset({id: item.id, url: item.url})
        task = new Task({
          data: imgAsset,
          excutionFunc: imgAsset.load.bind(imgAsset)
        })
        taskList.addTask(task);
        imgAsset.task = task // 索引任务对象，方便查看任务执行情况
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
  constructor({id, url}) {
    this.id = id
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
    this.image = options.image
    this.context = options.context
    this.onClick = options.onClick
  }
  draw() {
    this.context.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
}

// 零件
class Part extends Sprite {
  constructor(options) {
    super(options)
    this.fillColor = null;
    this.addEvents()
  }
  // addEvents () {
  //   this.on('click', this.click)
  // }
  // click () {

  // }
  // 改变颜色
  changeColor ({color}) {
    this.fillColor = color;
    this.image = this.changeImageColor({
      color: this.fillColor
    })
    this.draw();
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

// 颜色
class Color {
  constructor ({hex, r, g, b}) {
    this.hex = hex
    this.r = r
    this.g = g
    this.b = b
    this.init()
  }
  init () {
    // 如果有16进制，则算出rgb
    if (this.hex) {
      this.r = hexToDec(this.hex.substr(1, 2));
      this.g = hexToDec(this.hex.substr(3, 2));
      this.b = hexToDec(this.hex.substr(5, 2));
    } else {
      // 如果有rgb，则算出16进制
      this.hex = '#' + decToHex(this.r) + decToHex(this.g) + decToHex(this.b);
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
    this.addColors(this.colors);
  }
  addColors ({colors}) {
    if (!Array.isArray(colors)) {
      return;
    }
    this.colors = [
      ...colors
    ]
    let colorObj = null
    const newColorObjList = this.colors.map(color => {
      if (typeof color === 'string') {
        colorObj = new Color({hex: color})
      } else if (typeof color === 'object') {
        if (color.type === 'hex') {
          colorObj = new Color({hex: color.value})
        } else if (color.type === 'rgb'){
          colorObj = new Color({r: color.r, g: color.g, b: color.b})
        } else {
          // 其他颜色类型
        }
      }
      return colorObj
    })
    this.colorObjList = [
      ...newColorObjList
    ]
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
export default ColouringGame