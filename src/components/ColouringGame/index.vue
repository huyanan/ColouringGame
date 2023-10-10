<template>
  <div class="colouring-game" ref="gameContainer"></div>
</template>
<script>
import ColouringGame from './ColouringGame.js'
export default {
  name: 'ColouringGame',
  data() {
    return {}
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // 初始化
      const gameContainer = this.$refs.gameContainer
      // 创建
      const game = ColouringGame.init({
        container: gameContainer,
        width: 800,
        height: 800,
      })
    }
  }
}
</script>