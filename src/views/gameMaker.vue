<template>
  <div class="game-maker">
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script>
export default {
  data () {
    return {
      canvas: null,
      ctx: null
    }
  },
  mounted () {
    this.canvas = this.$refs.canvas
    this.canvas.width = document.body.clientWidth
    this.canvas.height = document.body.clientHeight
    this.ctx = this.canvas.getContext('2d')
    this.initEvent()
  },
  methods: {
    initEvent () {
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
        debugger
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
    createSprite () {

    }
  }
}
</script>
<style lang="scss" scoped>
.game-maker {
  width: 100vw;
  height: 100vh;
}
</style>