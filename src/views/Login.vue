<template>
  <div class="login">
    <section class="hero is-light is-fullheight">
      <div class="hero-body">
        <div class="container has-text-centered">
          <article v-show="errorMessage" class="message is-warning">
            <div class="message-body">
              {{ errorMessage }}
            </div>
          </article>
          <div class="column is-4 is-offset-4">
            <div class="box">
              <div class="field">
                <div class="control">
                  <validation-provider rules="required" v-slot="{ errors }">
                    <input class="input is-large" type="email" placeholder="Eメール" v-model="email" autofocus="" name="email">
                    <span>{{ errors[0] }}</span>
                  </validation-provider>
                 </div>
                 <!-- <div class="form-control-feedback" v-show="errors.has('email')">
                  <p class="alert alert-danger">{{ errors.first('email') }}</p>
                </div> -->
              </div>
              <div class="field">
                <div class="control">
                  <validation-provider rules="required" v-slot="{ errors }">
                    <input class="input is-large" type="password" placeholder="パスワード" v-model="password" rule="'required|min:6|max:20'" maxlength="20" name="password">
                    <span>{{ errors[0] }}</span>
                  </validation-provider>
                </div>
                <!-- <div class="form-control-feedback" v-show="errors.has('password')">
                  <p class="alert alert-danger">{{ errors.first('password') }}</p>
                </div> -->
              </div>
              <div class="field">
                <label class="checkbox">
                <input type="checkbox">
                ログインしたままにする
                </label>
               </div>
               <button class="button is-block is-info is-large is-fullwidth" @click="login()" >ログイン</button>
               <!-- <button class="button is-block is-info is-large is-fullwidth" @click="login()" :disabled="!isValidated" >ログイン</button> -->
              </div>
              <p class="has-text-grey">
                <a href="..">パスワードを忘れた方はこちら</a>
              </p>
            </div>
          </div>
        </div>
    </section>
  </div>
</template>

<script>
import {
  // ValidationObserver,
  ValidationProvider,
  extend
} from 'vee-validate'
import { required } from "vee-validate/dist/rules"
import {
  CREATE,
  DESTROY
} from '@/store/mutation-types'

extend('required', {
  ...required,
  // message: '{_field_}は必須です'
});

export default {
  name: 'Login',
  components: {
    // ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login() {
      this.$store.dispatch(
        `auth/${CREATE}`, {
          email: this.email,
          password: this.password
        }
      )
    }
  },
  computed: {
    // isValidated () {
    //   return Object.keys(this.fields).every(k => this.fields[k].validated) &&
    //     Object.keys(this.fields).every(k => this.fields[k].valid)
    // },
    token () {
      return this.$store.state.auth.token
    },
    errorMessage () {
      return this.$store.state.message.error
    }
  },
  created() {
    this.$store.dispatch(`message/${DESTROY}`)
    if (this.$store.state.auth.token) {
      // this.$router.push('/')
      console.log('ログイン済みです')
    }
    console.log(this.fields)
  },
  // watch: {
  //   token (newToken) {
  //     this.$router.push('/')
  //   }
  // }
}
</script>

<style scoped>
</style>
