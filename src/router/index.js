import Vue from 'vue'
import Router from 'vue-router'
import { store } from '../store'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('@/components/indexView')
    },
    {
      path: '/admin',
      redirect: '/admin/posts'
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
    },
    {
      path: '/admin/authors',
      name: 'Authors',
      component: () => import('@/components/authorsView')
    }
  ]
})

const privatePages = [ '/admin/categories', '/admin/authors' ]

router.beforeResolve((to, from, next) => {
  const token = store.state.token
  const userRole = store.state.UsersStore.currentUser.role

  // prevent not authorized access
  if (to.path !== '/' && !token) {
    next('/')
  } else
  // deny access for no-admin users to private pages
  if (token && userRole !== 'Admin' && privatePages.includes(to.path)) {
    next('/admin/posts')
  } else {
    next()
  }
})

export default router
