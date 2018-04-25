import Vue from 'vue'
import Vuex from 'vuex'
import { Api } from '../Api/Api'
//  Import modules
import СategoriesStore from './modules/categoriesStore'
import PostsStore from './modules/postsStore'
import UsersStore from './modules/usersStore'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    token: '',
    validatorRules: [ v => !!v || 'Поле обовʼязкове!' ]
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    clearToken (state) {
      state.token = ''
      localStorage.removeItem('token')
    }
  },
  modules: {
    СategoriesStore,
    PostsStore,
    UsersStore
  },
  actions: {
    initApp (context) {
      // prevently, search token in localStorage
      return new Promise(resolve => {
        // if token exist - execute get user
        if (localStorage.getItem('token')) {
          context.commit('setToken', localStorage.getItem('token'))
          context.dispatch('UsersStore/getThisUser', context.state.token)
            .then(() => resolve())
        } else {
          // else - just resolve
          resolve()
        }
      })
    },
    logIn (context, userData) {
      return Api.logIn(userData)
        .then(response => {
          context.commit('setToken', response.token)
          context.dispatch('UsersStore/getThisUser', context.state.token)
          return response.message
        })
    },
    logOut (context) {
      context.commit('clearToken')
      context.commit('UsersStore/clearUser')
      return true
    },
    loadFiles (context, blob) {
      const formData = new FormData()
      formData.append('file', blob)
      return Api.loadFiles(formData)
    }
  }
})
