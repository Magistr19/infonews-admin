<template lang='pug'>
  v-container(fill-height fluid align-center justify-center)
    v-flex(xs12 md6 lg4)
      v-card.px-3.py-3
        v-alert(v-model='error' type='error') {{ error }}
        v-form(v-model='valid' @submit.prevent='signIn' ref='signInForm')
          v-text-field(v-model='login' required label='Логін' :rules='validatorRules')
          v-text-field(v-model='password' required label='Пароль' :rules='validatorRules')
          v-btn(type='submit' :disabled='!valid || submitting') Увійти

</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      login: '',
      password: '',
      error: '',
      valid: false,
      submitting: false
    }
  },

  computed: mapState(['validatorRules']),

  methods: {
    ...mapActions(['logIn']),
    signIn () {
      this.submitting = true
      this.logIn({ login: this.login, password: this.password })
        .then(() => {
          this.submitting = false
          this.$refs.signInForm.reset()
          this.$router.push('/admin')
        })
        .catch(e => {
          this.submitting = false
          this.error = e.message
        })
    }
  }
}
</script>

<style>

</style>
