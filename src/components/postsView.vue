<template lang='pug'>
  v-container(app)
    v-form(v-model='valid' ref='postForm' @submit.prevent='submitForm')
      v-text-field(
        v-model='selectedPost.title'
        label='Назва'
        required
        :rules='validatorRules')

      app-file-input(
        @file='selectedPost.poster = $event'
        label='Постер'
        :required='true'
        accept='.jpg, .jpeg, .png')

      div(v-if='postImage')
        v-avatar(:src='postImage' size='200' :tile='true')

      v-select(
        :items='categoriesOptions'
        v-model='selectedPost.categories'
        label='Рубрика'
        required
        :rules='[ v => !!v.title || "Оберіть рубрику!" ]')

      v-select(
        :items='subcategoriesOptions(selectedPost.categories)'
        v-model='selectedPost.categories.subcategory.title'
        label='Підрубрика')

      wysiwyg(v-model='selectedPost.content')

      v-text-field(
        v-model='selectedPost.shortcat'
        multi-line
        label='Коротке описання'
        required
        :rules='validatorRules')

      v-btn(
        type='submit'
        :disabled='!valid || submitting || !selectedPost.content') Опублікувати
    v-snackbar(top right v-model='showSnackbar')
      | {{ info }}
      v-btn(flat color="pink" @click.native="showSnackbar = false") Закрити
</template>

<script>
import appFileInput from './appFileInput'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  components: {
    appFileInput
  },

  created () {
    this.getAllCategories()
  },

  data () {
    return {
      valid: false,
      submitting: false,
      showSnackbar: false,
      info: ''
    }
  },

  methods: {
    ...mapActions('СategoriesStore', ['getAllCategories']),
    ...mapActions('PostsStore', ['submitPost']),
    ...mapMutations('PostsStore', ['updateSelectedPost']),
    submitForm () {
      this.submitPost()
        .then(response => {
          this.submitting = false
          this.showInfo(response)
        })
        .catch(e => {
          this.submitting = false
          this.showInfo(e)
        })
    },
    subcategoriesOptions (choosedCategory) {
      let resultOptions = [{ value: { title: '', link: '' }, text: 'Без підрубрики' }]
      if (choosedCategory) {
        const category = this.categories.find(category => category.link === choosedCategory.link)
        if (category && category.subcategories) {
          category.subcategories.map(subCategory => {
            resultOptions.push({
              value: { title: subCategory.title, link: subCategory.link },
              text: subCategory.title
            })
          })
        }
      }
      return resultOptions
    },
    showInfo (response) {
      this.showSnackbar = true
      this.info = response.message
    }
  },

  computed: {
    ...mapGetters('PostsStore', ['selectedPost', 'postImage', 'postCategory', 'postSubcategory']),
    ...mapGetters('СategoriesStore', ['categories']),
    ...mapState(['validatorRules']),
    categoriesOptions () {
      let resultOptions = [{ value: '', text: 'Не обрано' }]
      if (this.categories) {
        this.categories.map(category => {
          resultOptions.push(
            {
              value: {
                link: category.link,
                title: category.title
              },
              text: category.title
            })
        })
      }
      return resultOptions
    }
  },

  watch: {
    'selectedPost': {
      handler: function (val) {
        this.updateSelectedPost(val)
      },
      deep: true
    }
  }
}
</script>

<style>

</style>
