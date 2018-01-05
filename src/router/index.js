import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import PortfolioDetail from '@/components/portfolio-detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/portfolio-detail/:id',
      name: 'PortfolioDetail',
      props: true,
      component: PortfolioDetail
    }
  ]
})