import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Tlist from '@/components/list'
import Test from '@/components/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path:'/tlist',
      name:'Tlist',
      component: Tlist
    },
    {
      path: '/s',
      name: 'Test',
      component: Test
    }
  ]
})
