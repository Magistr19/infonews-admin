import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('@/components/indexView')
    },
    {
      path: '/admin/posts',
      name: 'Posts',
      component: () => import('@/components/postsView')
    },
    {
      path: '/admin/categories',
      name: 'Categories',
      component: () => import('@/components/categoriesView')
    },
    {
      path: '/admin/postsList',
      name: 'PostsList',
      component: () => import('@/components/postsListView')
    }
  ]
})
