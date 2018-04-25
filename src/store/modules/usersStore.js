import { Api } from './../../Api/Api'
const UsersStore = {
  namespaced: true,
  state: {
    data: [],
    currentUser: null
  },
  getters: {
    users (state) {
      return state.data
    },
    thisUser (state) {
      return state.currentUser
    }
  },
  mutations: {
    clearUser (state) {
      state.currentUser = null
    },
    setUser (state, user) {
      state.currentUser = user
    }
  },
  actions: {
    getThisUser (context, token) {
      console.log('getThisUser')
      return Api.usersApi.getCurrentUser(token)
        .then(user => context.commit('setUser', user))
        .catch(e => console.error(e.message))
    },
    getAllUsers (context) {
      console.log('getAllUsers')
      return Api.usersApi.getAllUsers()
        .then(users => { context.state.data = users })
        .catch(e => console.error(e.message))
    },
    createAuthor (context, userData) {
      return Api.usersApi.createNewUser(userData)
        .then(response => {
          context.dispatch('getAllUsers')
          return response
        })
        .catch(e => { throw new Error(e.message) })
    }
  }
}
export default UsersStore
