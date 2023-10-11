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
  // 初始化资源管理器
  this.assetsManager = this.createAssetsManager()
}
// 创建资源管理器
ColouringGame.createAssetsManager = function() {

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


/**
 * 资源管理器
 * 加载图片，给图片指定唯一标识，查找获取图片
 * 创建图片对象Image
 */
class AssetsManager {
  constructor() {
    this.imgList = []
    this.imgMap = {}
    this.assets = []
    this.assetsMap = {}
    this.taskListCollection = []
    this.taskListMap = {}
  }
  load() {

  }
  async loadImg ({id, url}) {
    let imgAsset = new ImgAsset({id, url})
    let task = new Task({
      data: imgAsset,
      excutionFunc: imgAsset.load.bind(imgAsset)
    })
    this.imgList.push(imgAsset)
    this.imgMap[id] = imgAsset
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
  async loadImgs ({imgsInfo, onProgress, onLoaded, onError}) {
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
        imgAsset = new ImgAsset({id: item.id, url: item.url})
        task = new Task({
          data: imgAsset,
          excutionFunc: imgAsset.load.bind(imgAsset)
        })
        imgAsset.task = task // 索引任务对象，方便查看任务执行情况
        this.imgList.push(imgAsset)
        this.imgMap[item.id] = imgAsset
      })

      taskListRes = await taskList.doTasks()
      if (taskListRes.success) {
        res = {
          success: true,
          data: taskListRes.data,
          error: null,
          msg: ''
        }
      }
    }
  }
}

/**
 * 图片资源
 */
class ImgAsset {
  // 类型常量image
  static get type() {
    return 'image'
  }
  constructor({id, url}) {
    this.id = id
    this.url = url
    this.img = null // 图片对象 Image
    this.task = null;
    this.imgError = null;
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
      this.img = new Image()
      this.img.src = this.url
      this.img.onload = () => {
        this.loading = false
        this.loaded = true
        res = {
          success: true,
          data: this.img,
          msg: '图片加载成功'
        }
        resolve(res)
      }
      this.img.onerror = (error) => {
        this.loading = false
        this.loaded = false
        this.imgError = error;
        res = {
          success: false,
          error: this.imgError,
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
    if (typeof(excutionFunc) === 'function') {
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
  constructor({id, tasks}) {
    this.id = id || getUUid() // 任务列表id，便于查询
    this.tasks = tasks // 任务列表
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
  static get isDoing () {
    return this.status === 'doing'
  }
  // allSuccess(执行完成且都成功)
  static get isAllSuccess () {
    return this.status === 'allSuccess'
  }
  // allFailed
  static get isAllFailed () {
    return this.status === 'allFailed'
  }
  // 是否部分成功，部分失败
  static get isPartSuccess () {
    return this.status === 'partSuccess'
  }
  // 执行结束，但可能是allSuccess || allFailed || partSuccess
  static get isAllEnded() {
    return this.isAllSuccess || this.isAllFailed || this.isPartSuccess
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