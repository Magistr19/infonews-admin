import { Api } from './../../Api/Api'
const CategoriesStore = {
  namespaced: true,
  state: {
    data: [],
    selectedCategory: {
      title: '',
      link: '',
      subcategories: []
    }
  },
  getters: {
    categories: ({ data }) => (data),
    selectedCategory: ({ selectedCategory }) => (selectedCategory)
  },
  mutations: {},
  actions: {
    getAllCategories (context) {
      return Api.categoriesApi.getAllCategories()
        .then(response => {
          context.state.data = response
          console.log('get categories!', context.state.data)
        })
        .catch(e => console.error(e))
    },
    addNewCategory (context, newCategory) {
      return Api.categoriesApi.addNewCategory(newCategory)
        .then(response => {
          console.log(response)
          return response
        })
        .catch(e => console.error(e))
    },
    editCategory (context, editedCategory) {
      return Api.categoriesApi.editCategory(editedCategory)
        .then(response => {
          console.log(response)
          return response
        })
        .catch(e => console.error(e))
    },
    removeCategory (context, id) {
      return Api.categoriesApi.removeCategory(id)
        .then(response => {
          console.log(response)
          return response
        })
        .catch(e => console.error(e))
    }
  }
}
export default CategoriesStore
