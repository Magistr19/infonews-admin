<template lang='pug'>
  v-container
    v-subheader.headline Усі записи
    v-alert(:value='!loaded' type='info') Завантажується...
    v-alert(:value='loaded && !posts.length' type='info') Записів немає
    v-text-field(v-model='search' v-if='posts.length' label='Пошук по назві запису')
    template(v-for='post in computedPosts')
      v-card
        v-card-media(:src='"http://localhost:3000" + post.picture' height='150px')
          v-subheader.title {{ post.title }}
        v-card-text
          v-subheader Рубрика: {{ categoryTitle(post.categories) }}
          p {{ post.shortcat }}
          div
            v-icon(left) remove_red_eye
            span.pl-3 {{ post.views }}
            v-icon(left).ml-3 person
            span.pl-3 {{ post.author }}
            v-icon(left).ml-3 alarm
            span.pl-3 {{ toDateString(+post.date) }}
        v-card-actions
          v-btn(@click='selectPost(post._id)' icon color='green')
            v-icon edit
          v-btn(@click='deletePost(post._id)' icon color='pink')
            v-icon delete
      v-divider

    v-snackbar(v-model='showSnackbar' top right)
      | {{ info }}
      v-btn(flat color="pink" @click.native="showSnackbar = false") Закрити
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import toDateString from '@/assets/toDateString'
export default {
  created () {
    this.getAllPostsPreview()
      .then(() => { this.loaded = true })
  },

  data () {
    return {
      showSnackbar: false,
      info: '',
      loaded: false,
      search: ''
    }
  },

  methods: {
    ...mapActions('PostsStore', ['getAllPostsPreview', 'choosePost', 'removePost']),
    toDateString,
    categoryTitle (postCategories) {
      let resultString = postCategories.title
      if (postCategories.subcategory && postCategories.subcategory.title) {
        resultString += ' / ' + postCategories.subcategory.title
      }
      return resultString
    },
    selectPost (postId) {
      this.choosePost(postId)
        .then(() => this.$router.push('/admin/posts'))
    },
    deletePost (postId) {
      this.removePost(postId)
        .then(response => {
          this.info = response.message
          this.showSnackbar = true
          this.getAllPostsPreview()
        })
        .catch(e => {
          this.info = e.message
          this.showSnackbar = true
        })
    }
  },

  computed: {
    ...mapGetters('PostsStore', ['posts']),
    computedPosts () {
      if (!this.search) return this.posts
      else {
        return this.posts.filter(post => {
          return post.title
            .toUpperCase()
            .indexOf(this.search.toUpperCase(), 0) !== -1
        })
      }
    }
  }
}
</script>

<style>

</style>
