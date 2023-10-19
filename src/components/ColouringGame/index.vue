<template>
  <div class="colouring-game">
    <div class="game-container" ref="gameContainer"></div>
    <div class="debug">
      <div class="prev-distance">{{ debug.prevDistance }}</div>
      <div class="current-distance">{{ debug.currentDistance }}</div>
    </div>
    <div class="border-view" ref="borderView">

    </div>
    <button @click="onClickGenerateImage">生成图片</button>
    <!-- 生成图片预览 -->
    <img class="preview-image" :src="previewImage">
    <div class="color-palette">
      <div
        class="color"
        v-for="(colorItem, index) in colors"
        :key="index"
        :style="{
          'background-color': colorItem.color.hex,
        }"
        @click="onClickColor(colorItem.color)"></div>
    </div>
  </div>
</template>
<script>
import ColouringGame from './ColouringGame.js'
import gameData from './GameData'
export default {
  name: 'ColouringGame',
  data() {
    return {
      colors: [],
      palette: null,
      colouringGame: null,
      debug: {
        prevDistance: 0,
        currentDistance: 0,
      },
      previewImage: ''
    }
  },
  mounted () {
    document.body.addEventListener('touchmove', function (event) {
      event.preventDefault();
    })
    document.addEventListener('gesturestart', function (event) {
      event.preventDefault()
    })
    this.init()
  },
  methods: {
    init () {
      const self = this
      const gameContainer = this.$refs.gameContainer

      // 初始化游戏框架
      this.colouringGame = new ColouringGame({
        container: gameContainer,
        width: 500,
        height: 500,
        debug: this.debug,
        onClickPart (part) {
          console.log('onClickPart', {
            part
          })
          const canvas = this.showPartBorder(part)
          self.$refs.borderView.replaceChildren(canvas) 
        }
      })
      console.log('游戏框架初始化完成', {
        colouringGame: this.colouringGame,
      });
      const comics = gameData.comics;
      const palette = gameData.palette;
      // 初始化游戏
      this.colouringGame.initGame({
        palette,
        backplace: comics[0].backplace,
      })

      // 生成颜料盘
      this.initPalette()

    },
    initPalette () {
      console.log('initPalette', {
        palette: this.colouringGame.palette,
      });
      this.palette = this.colouringGame.palette
      this.colors = this.palette.colorObjList;
    },
    onClickColor (color) {
      this.colouringGame.changeCurrentPartColor({
        color
      })
    },
    onClickGenerateImage () {
      this.previewImage = this.colouringGame.generateImage()
    }
  }
}
</script>

<style lang="scss" scoped>
.color-palette {
  display: flex;
  align-items: center;
}
.color {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin: 5px;
  cursor: pointer;
}
</style>