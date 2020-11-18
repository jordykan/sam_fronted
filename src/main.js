import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';
import DatetimePicker from 'vuetify-datetime-picker'
import VueBarcode from 'vue-barcode'
import Vuelidate from 'vuelidate'
import VuePapaParse from 'vue-papa-parse'
Vue.use(DatetimePicker)
Vue.config.productionTip = false
Vue.component('barcode', VueBarcode)

axios.defaults.baseURL='https://amls-sam.herokuapp.com/api/'

const moment = require('moment');
require('moment/locale/es')
Vue.use(VuePapaParse)
Vue.use(require('vue-moment'),{
  moment
})
Vue.use(Vuelidate);


new Vue({
  router,
  store,
  vuetify,
  
  render: h => h(App)
}).$mount('#app')
