import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as VeeValidate from 'vee-validate'
import ja from 'vee-validate/dist/locale/ja'
import './plugins/element.js'
require('@/assets/sass/main.scss')

Vue.use(VeeValidate, { locale: ja, dictionary: { ja } });
Vue.config.productionTip = false

console.log(VeeValidate)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
