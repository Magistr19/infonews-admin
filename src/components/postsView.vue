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
        v-model='selectedPost.categories.title'
        @change='chooseCategory'
        label='Рубрика'
        required
        :rules='[ v => !!v || "Оберіть рубрику!" ]')

      v-select(
        :items='subcategoriesOptions(selectedPost.categories)'
        v-model='selectedPost.categories.subcategory.title'
        @change='chooseSubcategory'
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
    ...mapMutations('PostsStore', ['updateSelectedPost', 'chooseCategory', 'chooseSubcategory']),
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
    chooseCategory (catTitle) {
      if (!catTitle) this.selectedPost.categories.link = ''
      else {
        this.selectedPost.categories.link = this.categories.find(cat => cat.title === catTitle).link
      }
    },
    chooseSubcategory (subcatTitle) {
      if (!subcatTitle) this.selectedPost.categories.subcategory.link = ''
      else {
        const subcategories = this.categories.find(cat => cat.title === this.selectedPost.categories.title).subcategories
        this.selectedPost.categories.subcategory.link = subcategories.find(subcat => subcat.title === subcatTitle).link
      }
    },
    subcategoriesOptions (choosedCategory) {
      let resultOptions = [{ value: '', text: 'Без підрубрики' }]
      if (choosedCategory) {
        const category = this.categories.find(category => category.link === choosedCategory.link)
        if (category && category.subcategories) {
          category.subcategories.map(subCategory => {
            resultOptions.push({
              value: subCategory.title,
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
              value: category.title,
              text: category.title
            })
        })
      }
      return resultOptions
    }
  },

  watch: {
    'selectedPost.categories.title': function () {
      this.selectedPost.categories.subcategory = { link: '', title: '' }
    },
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
.editr {
  border: 0;
}
.editr--content {
  min-height: 300px;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
}
.editr--toolbar {
  background: #212121;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
  border: 0;
}
.editr--toolbar a {
  fill: #ffffff;
}
.editr--toolbar .dashboard {
  background: #212121;
  color: #ffffff;
}
</style>

