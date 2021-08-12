import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueVideoSection from 'vue-video-section'
import 'vue-video-section/dist/vue-video-section.css'

Vue.component('vue-video-section', VueVideoSection)

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
