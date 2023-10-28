<template>
    <div v-show="isShow" class="popup-menu" ref="conversationMenu" :style="style" v-click-outside="close">
      <div class="menu-list">
        <div class="menu-item" v-for="menuItem in menu" :key="menuItem.command" @click="onClickMenuItem(menuItem)">
            <img v-if="menuItem.icon" class="icon" :src="menuItem.icon">
            <span class="menu-text">{{menuItem.label}}</span>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    name: 'MyMenu',
    props: {
    },
    data () {
        return {
            isShow: false,
            menu: [],
            style: {
                x: 0,
                y: 0,
            },
            data: null
        }
    },
    methods: {
        show (options) {
            this.menu = options.menu;
            this.style = options.style;
            this.isShow = true;
            this.data = options.data;
        },
        close () {
            this.isShow = false;
        },
        onClickMenuItem (menuItem) {
            if (typeof menuItem.onClick == 'function') {
              menuItem.onClick({
                menuItem,
                data: this.data
              })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.popup-menu {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  border-radius: 6px;
  width: 140px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.12);
  // box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.08);
  .menu-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .menu-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      text-align: left;
      width: 132px;
      height: 44px;
      margin: 4px 0;
      padding-left: 12px;
      cursor: pointer;
      .menu-text {
        margin-left: 6px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        line-height: 20px;
        color: #191919;
      }
    }
    .menu-item:hover {
      background: #F7F7F7;
    }
  }
  .icon {
    width: 20px;
    height: 20px;
  }
}
</style>