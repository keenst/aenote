import { createApp } from 'vue'
import './style.css'
import  router from './router'
import App from './App.vue'
import './assets/css/tailwind.css'

createApp(App).use(router).mount('#app')
