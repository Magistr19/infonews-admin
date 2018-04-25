<template lang='pug'>
  v-card.px-3.py-3
    v-subheader.headline.pl-0 Рубрики
    v-divider
    v-expansion-panel
      v-expansion-panel-content(v-for='category,i in categories' :key='i')
        div(slot='header')
          v-layout(justify-between row)
            v-subheader {{ category.title }}
            v-subheader Підрубрик: {{ category.subcategories.length }}
        v-card.px-2.py-2
          ul(v-if='category.subcategories.length').ml-3
            li(v-for='subcategory,i in category.subcategories' :key='i') {{ subcategory.title }}
          v-card-actions
            v-btn(icon color='teal' @click.native='chooseCategory(category)')
              v-icon edit
            v-btn(icon color='pink' @click.native='deleteCategory(category._id)')
              v-icon delete
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: mapGetters('СategoriesStore', ['categories']),

  methods: {
    ...mapActions('СategoriesStore', ['removeCategory', 'getAllCategories']),
    chooseCategory (cat) {
      this.$emit('chooseCategory', { ...cat })
    },
    deleteCategory (id) {
      this.removeCategory(id)
        .then(response => {
          this.$emit('showInfo', response)
          this.getAllCategories()
        })
        .catch(e => this.$emit('showInfo', e))
    }
  }
}
</script>

<style>

</style>
