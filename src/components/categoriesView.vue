<template lang='pug'>
  v-container(app grid-list-md)
    v-layout(row wrap)
      v-flex(xs12 lg6)
        v-card.px-3.py-3
          v-layout(justify-between row)
            v-subheader.headline.pl-0 {{ edit ? "Відредагувати рубрику: " + category.title : "Додати нову рубрику" }}
            v-btn(@click.native='resetForm' icon color='pink' flat v-if='edit')
              v-icon restore_page
          v-form(
            v-model='validCat'
            ref='categoriesForm'
            @submit.prevent='submitCategory')
            v-text-field(
              v-model='category.title'
              label='Назва рубрики'
              :rules='validatorRules'
              required)
            v-text-field(
              v-model='subcategory.title'
              label='Назва підрубрики')
            v-btn(@click.native='addSubcategory') Додати підрубрику
            v-subheader Підрубрики: {{ category.subcategories.length }}
            ul.ml-3
              li(v-for='subcategory,i in category.subcategories' :key='i')
                span {{ subcategory.title }}
                v-btn(icon flat @click.native='removeSubcategory(subcategory)')
                  v-icon delete
                v-divider
            
            v-btn(type='submit' :disabled='!validCat || submitting') {{ edit ? "Відредагувати" : "Додати" }}

      v-flex(xs12 lg6)
        categories-list(
          @chooseCategory='chooseCategory'
          @showInfo='showInfo')

    v-snackbar(top right v-model='showSnackbar')
      | {{ info }}
      v-btn(flat color="pink" @click.native="showSnackbar = false") Закрити
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import cyrToLat from '@/assets/cyrToLat'
export default {
  components: {
    categoriesList: () => import('./categoriesList')
  },

  created () {
    this.getAllCategories()
  },

  data () {
    return {
      validCat: false,
      validSubCat: false,
      submitting: false,
      category: {
        title: '',
        link: '',
        subcategories: []
      },
      subcategory: {
        title: '',
        link: ''
      },
      edit: false,
      info: '',
      showSnackbar: false
    }
  },

  computed: {
    ...mapGetters('СategoriesStore', ['categories']),
    ...mapState(['validatorRules']),
    categoriesOptions () {
      const result = []
      this.categories.slice(0).forEach(cat => result.push({ value: cat, text: cat.title }))
      return result
    }
  },

  watch: {
    // set latin variant of title for category link
    'category.title': function (val) {
      this.category.link = cyrToLat(val)
    },
    'subcategory.title': function (val) {
      this.subcategory.link = cyrToLat(val)
    }
  },

  methods: {
    ...mapActions('СategoriesStore', [
      'getAllCategories',
      'addNewCategory',
      'editCategory']),
    cyrToLat,
    submitCategory () {
      // disable submit btn for wait send request
      this.submitting = true
      new Promise((resolve, reject) => {
        if (this.edit) {
          this.editCategory({ ...this.category })
            .then(res => resolve(res))
            .catch(e => reject(e))
        } else {
          return this.addNewCategory({ ...this.category })
            .then(res => resolve(res))
            .catch(e => reject(e))
        }
      })
      .then(response => {
        this.showInfo(response)
        this.resetForm()
        this.submitting = false
        this.getAllCategories()
      })
      .catch(e => {
        this.showInfo(e)
        this.submitting = false
      })
    },
    // show info in snackbar
    showInfo (response) {
      this.info = response.message
      this.showSnackbar = true
    },
    // choose existed category for edit
    chooseCategory (cat) {
      this.edit = true
      this.category = cat
    },
    addSubcategory () {
      if (this.subcategory.title) {
        this.category.subcategories.push(this.subcategory)
      }
    },
    removeSubcategory (subcategory) {
      this.category.subcategories = this.category.subcategories.filter(subcat => subcat !== subcategory)
    },
    resetForm () {
      this.edit = false
      this.category = {
        title: '',
        link: '',
        subcategories: []
      }
      this.subcategory = {
        title: '',
        link: ''
      }
    }
  }
}
</script>
