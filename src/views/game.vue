<template>
  <div class="game">
    <ColouringGame></ColouringGame>
  </div>
</template>
<script>
import ColouringGame from '@/components/ColouringGame/index.vue'
export default {
  components: {
    ColouringGame
  }
}
</script>

<style lang="scss" scoped>
.game {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
