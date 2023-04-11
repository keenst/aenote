<template>
  <div class="p-4">
    <form v-if="hasAccount" @submit.prevent="login(username, password)" class="space-y-2">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username">
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password">  
      </div>
      <button type="submit">Login</button>
      <div @click="hasAccount = false" class="text-gray-400 text-xs">Don't have an account?</div>
    </form>
    <form v-else @submit.prevent="" class="space-y-2">
      <div>
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username">
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password">  
      </div>
      <button type="submit">Create account</button>
      <div @click="hasAccount = true" class="text-gray-400 text-xs">Have an account?</div>
    </form>
  </div>
</template>

<script lang="ts">

import { ref } from 'vue'
import router from '../router'
import { useUserStore } from '../stores/userStore'
import { RouteLocationRaw } from 'vue-router'

export default {
  data() {
    return {
      hasAccount: true,
      username: '',
      password: '',
      id: []
    }
  },
  setup() {
    const store = useUserStore()

    async function login(username: String, password: String) {
      const Http = new XMLHttpRequest()
      const url = "http://localhost:1337/auth/"
      const body: any = 
      {
        "username": username,
        "password": password
      }

      Http.open("POST", url)
      Http.setRequestHeader('Content-Type', 'application/json')
      
      Http.send(JSON.stringify(body))
      
      Http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          const response = JSON.parse(Http.responseText)
          console.log(response._id)
          store.user_id = response._id
          console.log(store.user_id)
          router.push('/notes')
        }
      }
    }

    return {
      login
    }
  }
}
</script>