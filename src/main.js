import Vue from 'vue'
import App from './App.vue'

import smartTable from '../smartTable';
Vue.use(smartTable);

new Vue({
  el: '#app',
  render: h => h(App)
})
