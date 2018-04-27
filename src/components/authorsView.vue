<template lang='pug'>
  v-container(app grid-list-md)
    v-layout(row wrap)
      v-flex(xs12 md6)
        v-card.px-3.py-3
          v-subheader.headline Додати нового автора
          v-form(@submit.prevent='addAuthor' v-model='valid' ref='authorForm')
            v-text-field(v-model='user.nick' required :rules='validatorRules' label='ПІБ автора')
            v-text-field(v-model='user.email' required :rules='validatorRules' type='email' label='Пошта автора')
            v-btn(type='submit' :disabled='!valid || submitting') Відправити доступ
      v-flex(xs12 md6)
        v-card.px-3.py-3
          v-subheader.headline Автори InfoNews
          v-divider
          template(v-for='user in users')
            v-layout
              v-subheader.title {{ user.name }}
              v-btn(icon @click.native='removeAuthor(user._id)')
                v-icon close
            v-divider
    v-snackbar(top right v-model='showSnackbar')
      | {{ info }}
      v-btn(flat color="pink" @click.native="showSnackbar = false") Закрити
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
export default {
  created () {
    this.getAllUsers()
  },

  data () {
    return {
      user: {
        nick: '',
        email: ''
      },
      valid: false,
      submitting: false,
      showSnackbar: false,
      info: false
    }
  },

  methods: {
    ...mapActions('UsersStore', ['createAuthor', 'getAllUsers', 'deleteAuthor']),
    addAuthor () {
      this.createAuthor(this.user)
        .then(response => {
          this.$refs.authorForm.reset()
          this.showInfo(response.message)
        })
        .catch(e => this.showInfo(e.message))
    },
    removeAuthor (id) {
      this.deleteAuthor(id)
        .then(response => this.showInfo(response.message))
        .catch(e => this.showInfo(e.message))
    },
    showInfo (info) {
      this.info = info
      this.showSnackbar = true
    }
  },

  computed: {
    ...mapGetters('UsersStore', ['users']),
    ...mapState(['validatorRules'])
  }
}
</script>

<style>

</style>
