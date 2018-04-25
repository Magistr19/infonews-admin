<template lang='pug'>
  v-app(dark)

    v-navigation-drawer(v-model='drawer' fixed app v-if='thisUser')
      v-list
        v-list-tile
          v-btn(to='/admin/categories' flat v-if='thisUser.role === "Admin"') Рубрики
        v-list-tile
          v-btn(to='/admin/posts' flat) Новий запис
        v-list-tile
          v-btn(to='/admin/postsList' flat) Усі запис
        v-list-tile
          v-btn(to='/admin/authors' flat v-if='thisUser.role === "Admin"') Автори

    v-toolbar(app)
      v-toolbar-side-icon(@click.stop="drawer = !drawer" v-if='thisUser')
      v-toolbar-title
        span.blue--text Info
        span.red--text News 
        span | Адмінпанель
      v-spacer
      v-toolbar-title(v-if='thisUser') {{ thisUser.name }}
      v-btn(@click.native='signOut' color='warning') Вийти

    v-content
      v-slide-y-transition(mode="out-in")
        router-view

    v-footer( app)
      span &copy; 2018
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      drawer: true
    }
  },

  created () {
    this.initApp()
  },

  computed: mapGetters('UsersStore', ['thisUser']),

  methods: {
    ...mapActions(['initApp', 'logOut']),
    signOut () {
      this.logOut()
      this.$router.push('/')
    }
  },

  watch: {
    '$route': function () {
      this.drawer = false
    }
  },

  name: 'App'
}
</script>
