import { Api } from './../../Api/Api'
import { store } from '../index'

const CategoriesStore = {
  namespaced: true,
  state: {
    postsList: [],
    selectedPost: {
      title: '',
      picture: null,
      shortcat: '',
      content: '',
      views: 0,
      categories: {
        title: '',
        link: '',
        subcategory: {
          title: '',
          link: ''
        }
      },
      _id: ''
    },
    edit: false
  },
  getters: {
    posts: ({ postsList }) => (postsList),
    selectedPost: ({ selectedPost }) => (selectedPost),
    postImage (state) {
      const img = state.selectedPost.picture
      if (!img) return ''
      if (img instanceof File) {
        return `${URL.createObjectURL(img)}`
      } else {
        return 'http://localhost:3000' + img
      }
    },
    postCategory (state) {
      return {
        title: state.selectedPost.categories.title,
        link: state.selectedPost.categories.link
      }
    },
    postSubcategory (state) {
      return {
        title: state.selectedPost.categories.subcategory.title,
        link: state.selectedPost.categories.subcategory.link
      }
    }
  },
  mutations: {
    updateSelectedPost (state, update) {
      state.selectedPost = update
    },
    setSelectedPost (state, post) {
      state.selectedPost = post
    },
    setPostsList (state, posts) {
      state.postsList = posts
    },
    resetPost (state) {
      state.selectedPost = {
        title: '',
        picture: null,
        shortcat: '',
        content: '',
        views: 0,
        categories: {
          title: '',
          link: '',
          subcategory: {
            title: '',
            link: ''
          }
        },
        _id: ''
      }
      state.edit = false
    }
  },
  actions: {
    submitPost ({ dispatch, state }) {
      if (state.edit) {
        return dispatch('editPost')
          .then(response => {
            state.edit = false
            return response
          })
          .catch(e => { throw new Error(e.message) })
      } else {
        return dispatch('addNewPost')
          .then(response => response)
          .catch(e => { throw new Error(e.message) })
      }
    },
    getPostById ({ commit }, id) {
      return Api.postsApi.getPostById(id)
        .then(response => {
          commit('setSelectedPost', response)
          return true
        })
        .catch(e => { throw new Error(e.message) })
    },
    getAllPostsPreview ({ commit }) {
      return Api.postsApi.getAllPostsPreview(store.state.token)
        .then(response => commit('setPostsList', response))
        .catch(e => { throw new Error(e.message) })
    },
    addNewPost ({ state, commit }) {
      return Api.postsApi.addNewPost(state.selectedPost, store.state.token)
        .then(response => {
          commit('resetPost')
          return response
        })
        .catch(e => { throw new Error(e.message) })
    },
    editPost ({ state, commit }) {
      return Api.postsApi.editPost(state.selectedPost, state.selectedPost._id, store.state.token)
        .then(response => {
          commit('resetPost')
          return response
        })
        .catch(e => { throw new Error(e.message) })
    },
    removePost (context, id) {
      return Api.postsApi.removePost(id)
        .then(response => response)
        .catch(e => { throw new Error(e.message) })
    },
    choosePost ({ dispatch, state }, postId) {
      state.edit = true
      return dispatch('getPostById', postId)
    }
  }
}
export default CategoriesStore
