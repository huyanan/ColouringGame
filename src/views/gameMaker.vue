<template>
  <div class="game-maker">
    <div class="top-panel">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <!-- <el-menu-item index="1">处理中心</el-menu-item> -->
        <el-submenu index="0">
          <template slot="title">文件</template>
          <el-menu-item index="new">新建</el-menu-item>
          <el-menu-item index="open">打开</el-menu-item>
          <el-menu-item index="save">保存</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="main-view">
      <div class="left-panel">
        <!-- 左侧节点树 -->
        <div class="node-tree">
          <el-tree
            :data="nodeTreeData"
            node-key="id"
            default-expand-all
            @node-drag-start="handleDragStart"
            @node-drag-enter="handleDragEnter"
            @node-drag-leave="handleDragLeave"
            @node-drag-over="handleDragOver"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
            draggable
            :allow-drop="allowDrop"
            :allow-drag="allowDrag">
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
              @contextmenu.stop.prevent="rightClickTreeItem($event, node)"
              @click.stop.prevent="handleNodeClick(node, data)"
            >
              <span>{{ node.label }}</span>
              <span>
                <!-- <el-button
                  type="text"
                  size="mini"
                  @click="() => append(data)">
                  Append
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click="() => remove(node, data)">
                  Delete
                </el-button> -->
              </span>
            </span>
          </el-tree>
          <!-- 右键菜单 -->
          <MyMenu ref="menu"></MyMenu>
        </div>
      </div>
      <div class="center-panel">
        <canvas ref="canvas"></canvas>
      </div>
      <div class="right-panel">
        <!-- 属性面板 -->
        <AttrPanel></AttrPanel>
      </div>

    </div>
    
    <!-- 弹窗 -->
    <!-- 新建文件 -->
    <NewFileDialog></NewFileDialog>
    <!-- 打开文件 -->
    <OpenFileDialog></OpenFileDialog>
    <!-- 保存文件 -->
    <!-- <SaveFileDialog></SaveFileDialog> -->
  </div>
</template>
<script>
import AttrPanel from '../components/GameMaker/AttrPanel.vue'
import NewFileDialog from '../components/GameMaker/NewFile.vue'
import OpenFileDialog from '../components/GameMaker/OpenFile.vue'
import MyMenu from '../components/MyMenu.vue'
import {Comic} from '../components/GameMaker/Comic';
export default {
  name: 'GameMaker',
  components: {
    AttrPanel,
    NewFileDialog,
    OpenFileDialog,
    MyMenu
  },
  data () {
    return {
      canvas: null,
      ctx: null,
      activeIndex: '0',
      nodeTreeData: [
        // {
        //   id: 1,
        //   label: '一级 1',
        //   children: [{
        //     id: 4,
        //     label: '二级 1-1',
        //     children: [{
        //       id: 9,
        //       label: '三级 1-1-1'
        //     }, {
        //       id: 10,
        //       label: '三级 1-1-2'
        //     }]
        //   }]
        // }, {
        //   id: 2,
        //   label: '一级 2',
        //   children: [{
        //     id: 5,
        //     label: '二级 2-1'
        //   }, {
        //     id: 6,
        //     label: '二级 2-2'
        //   }]
        // }, {
        //   id: 3,
        //   label: '一级 3',
        //   children: [{
        //     id: 7,
        //     label: '二级 3-1'
        //   }, {
        //     id: 8,
        //     label: '二级 3-2',
        //     children: [{
        //       id: 11,
        //       label: '三级 3-2-1'
        //     }, {
        //       id: 12,
        //       label: '三级 3-2-2'
        //     }, {
        //       id: 13,
        //       label: '三级 3-2-3'
        //     }]
        //   }]
        // }
    
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    nodeTreeData: {
      handler (val) {
        this.save();
      },
      deep: true
    }
  },
  mounted () {
    this.canvas = this.$refs.canvas
    this.canvas.width = document.body.clientWidth
    this.canvas.height = document.body.clientHeight
    this.ctx = this.canvas.getContext('2d')
    this.initEvent()

    // 默认打开上次的漫画
    this.openLastComic()

    this.render()
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
      this.$eventBus.$emit('select',  {
        key: key,
        keyPath: keyPath
      })
      this.$eventBus.$emit(key)
    },
    render () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.renderChildren(this.nodeTreeData)
      window.requestAnimationFrame(this.render.bind(this))
    },
    renderChildren (children) {
      if (Array.isArray(children)) {
        children.forEach((node) => {
          node.render(this.ctx)
          this.renderChildren(node.children)
        })
      }
      
    },
    initEvent () {
      this.$eventBus.$on('openedFile', this.openComic)
      // 监听鼠标移动事件
      // this.canvas.onmousemove = (e) => {
      //   // const { offsetX, offsetY }
      // }
      this.canvas.addEventListener("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation()
      });
      this.canvas.addEventListener("dragenter", function(e) {
        // this.canvas.classList.add("dragover");
        e.preventDefault();
        e.stopPropagation()
        console.log('mouseup', e)
      });
      this.canvas.addEventListener("drop", function(e) {
        e.preventDefault();
        e.stopPropagation()

        var data = e.dataTransfer.getData("image/png");
        console.log(data);
      });
      // this.canvas.addEventListener('mousemove', (e) => {
      //   console.log('mousemove', e)
      //   e.preventDefault()
      //   e.stopPropagation()
      // })
      // this.canvas.addEventListener('mouseup', (e) => {
      //   console.log('mouseup', e)
      //   e.preventDefault()
      //   e.stopPropagation()
      // })
    },
    // 打开上次的漫画
    openLastComic () {
      const lastComicFileStr = localStorage.getItem('lastComicFile')
      if (lastComicFileStr) {
        try {
          const lastComicFile = JSON.parse(lastComicFileStr)
          this.getFile(lastComicFile)
          
        } catch (error) {
          
        }

      }
    },
    // handleOpendFile (file) {
    //   console.log('handleOpendFile', file);
    //   this.openComic(file)
    // },
    getFile(selectFile){
      // 提交
      this.$axios.post("/api/maker/readComic", {
          filePath: selectFile.filePath,
      })
      .then(res => {
          console.log(res)
        this.openComic(res.data)
      })
    },
    openComic (file) {
      console.log('openComic', file);
      const json = file.json;
      const comic = this.createComic(json)
      this.filePath = file.filePath
      this.nodeTreeData = [comic]
      this.saveLastComicFile();
    },
    // 保存上次修改的漫画
    saveLastComicFile (comicFile) {
      localStorage.setItem('lastComicFile', JSON.stringify(comicFile))
    },
    createComic (data) {
      let comicOptions = {
        ...data
      }
      if (!comicOptions.id) {
        comicOptions.id = this.$utils.uuid()
      }
      if (!comicOptions.label) {
        comicOptions.label = '漫画'
      }
      if (!comicOptions.children) {
        comicOptions.children = []
      }
      const comic = new Comic(comicOptions)

      return comic
    },
    // 漫画菜单
    comicMenu (node) {
      return [
        {
          label: '新建',
          click: () => {
            this.$eventBus.$emit('newComic')
          }
        }
      ]
    },
    rightClickTreeItem (event, node) {
      // 获取鼠标位置
      const left = `${event.clientX}px`
      const top = `${event.clientY}px`
      console.log('rightClickTreeItem', left, top)

      console.log('showMenu', node)

      this.$refs.menu.show({
        style: {
          left,
          top
        },
        data: node.data,
        menu: [
          {
            label: '创建零件',
            command: 'createPart',
            onClick: ({menuItem, data}) => {
              data.createPart()
            }
          },
          {
            label: '删除',
            command: 'delete',
            onClick: ({menuItem, data}) => {
              if (data.type === 'comic') {
                this.nodeTreeData.splice(this.nodeTreeData.indexOf(node.data), 1)
              } else if (data.type === 'part') {
                data.removeSelf()
              } else {
                data.removeSelf()
              }
            }
          }
        ],
      })
    },
    handleNodeClick (node, data) {
      // 展示属性面板
      this.$eventBus.$emit('showAttrPanel', data)
    },
    createPart () {

    },
    save () {
      // this.nodeTreeData.forEach(node => {

      // })
      // const comic = this.nodeTreeData[0]
      let comicList = {}
      function getChildrenJson (nodeList) {
        return nodeList.map((node) => {
          let nodeJson = {}
          Object.keys(node).forEach(key => {
            if (key === 'parent' || key === 'comic') {
              // json[key] = this.children.map
            } else if (key === 'children'){
              nodeJson[key] = getChildrenJson(node[key])
            } else {
              nodeJson[key] = node[key]
            }
          })
          return nodeJson
        })
        
      }
      comicList = getChildrenJson(this.nodeTreeData)
      let comicJson = comicList[0]
      
      
      const jsonStr = JSON.stringify(comicJson, null, "\t");
      console.log('save', jsonStr)
      this.$axios.post('/api/maker/save', {
        filePath: this.filePath,
        json: jsonStr
      }).then((res) => {
        this.saveLastComicFile({filePath: this.filePath, json: comicJson})
      })
    },
    showConversationMenu (options) {
      console.log('showConversationMenu', {
        options
      });
      this.conversationMenuOptions = {...options};
    },
    createSprite () {

    },
    handleDragStart () {},
    handleDragEnter () {},
    handleDragLeave () {},
    handleDragOver () {},
    handleDragEnd () {},
    handleDrop () {},
    allowDrag () {},
    allowDrop () {}
  }
}
</script>
<style lang="scss" scoped>
// .title {
//   color: red;
//   font-size: 20px;;
// }
.game-maker {
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #333;
  flex-direction: column;
}
.top-panel {
  flex: 0 0 auto;
}
.main-view {
  flex: 1 1 auto;
  display: flex;
  overflow: hidden;
}

.left-panel {
  flex: 0 0 auto;
  width: 200px;
  height: 100%;
  background-color: rgb(238, 238, 238);
  border-right: 1px solid rgb(204, 204, 204);
}
.custom-tree-node {
  width: 100%;
  height: 100%;
}
.center-panel {
  flex: 1 1 auto;
  overflow: hidden;
}
.right-panel {
  flex: 0 0 auto;
  // width: 200px;
  height: 100%;
  background-color: rgb(238, 238, 238);
}
</style>