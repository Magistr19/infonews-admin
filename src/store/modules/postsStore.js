import { Api } from './../../Api/Api'
import { store } from '../index'

const CategoriesStore = {
  namespaced: true,
  state: {
    postsList: [],
    selectedPost: {
      title: '',
      poster: null,
      shortcat: '',
      content: '',
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
      const img = state.selectedPost.poster
      if (!img) return ''
      if (img instanceof File) {
        return `${URL.createObjectURL(img)}`
      } else {
        return img
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
    addNewPost ({ state }) {
      console.log('Create: ', state.selectedPost)
      /*
      return Api.postsApi.addNewPost(post)
        .then(response => { console.log(response); return response })
        .catch(e => console.error(e)) */
    },
    editPost ({ state }) {
      console.log('Edit: ', state.selectedPost)
      /*
      return Api.postsApi.editPost(data.formData, data.id)
        .then(response => { console.log(response); return response })
        .catch(e => console.error(e)) */
    },
    removePost (context, id) {
      console.log('Remove: ', id)
      /*
      return Api.postsApi.removePost(id)
        .then(response => { console.log(response); return response })
        .catch(e => console.error(e)) */
    },
    choosePost ({ dispatch, state }, postId) {
      state.edit = true
      return dispatch('getPostById', postId).then(() => console.log('!'))
    }
  }
}
export default CategoriesStore
