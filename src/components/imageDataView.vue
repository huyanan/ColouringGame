<template>
  <div class="image-data-view">
    <div class="data-list">
      <div class="row" v-for="">
        <div class="column"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imageData: [
        
      ]
    }
  },
  mounted () {
  },
  methods: {
    showExample () {
      this.imageData = {}
    }
  }
}
</script>