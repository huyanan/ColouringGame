<template>
  <div class="colouring-game">
    <div class="game-container" ref="gameContainer"></div>
    <div class="color-palette">
      <div
        class="color"
        v-for="color in colors"
        :key="color.id"
        :style="{
          backgroundColor: color.hex,
        }"
        @click="onClickColor(color)"></div>
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
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const gameContainer = this.$refs.gameContainer

      // 初始化游戏框架
      this.colouringGame = new ColouringGame({
        container: gameContainer,
        width: 800,
        height: 800,
      })
      console.log('游戏框架初始化完成', {
        colouringGame: this.colouringGame,
      });
      // 初始化游戏
      this.colouringGame.initGame(gameData)

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