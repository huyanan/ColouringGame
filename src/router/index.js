import Vue from 'vue'
import Router from 'vue-router'
import game from '@/views/game'
import gameMaker from '@/views/gameMaker'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'game',
      component: game
    },
    {
      path: '/game_maker',
      name: 'gameMaker',
      component: gameMaker
    }
  ]
})
