// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from './api/index'
// import GameMakerConfig from 'GameMakerConfig'
import utils from './utils/index'
import vClickOutside from 'v-click-outside'
import '@/assets/css/global.scss'

Vue.config.productionTip = false


Vue.use(ElementUI);

Vue.prototype.$eventBus = new Vue();

Vue.prototype.$axios = axios

Vue.prototype.$GameMakerConfig = GameMakerConfig

Vue.prototype.$utils = utils


Vue.use(vClickOutside)
// console.log('process.env', process.env)
// console.log('gameMakerConfig', GameMakerConfig)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
