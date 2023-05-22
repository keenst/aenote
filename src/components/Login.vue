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
    <form v-else @submit.prevent="createAccount(username, password)" class="space-y-2">
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

import router from '../router'
import { useUserStore } from '../stores/userStore'

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
      const body: any = {
        "username": username,
        "password": password
      }

      try {
        const response = await postRequest("http://localhost:1337/auth/", body)
        store.user_id = response._id
        router.push('/notes')

      } catch (error) {
        console.error("Error logging in:", error)
        return
      }
    }

    async function createAccount(username: String, password: String) {
      const body: any = {
        "username": username,
        "password": password
      }

      try {
        await postRequest("http://localhost:1337/users/", body)
        login(username, password)
      } catch (error) {
        console.error("Error creating account:", error)
      }
    }

    async function postRequest(url: string | URL, body: any): Promise<any> {
      return new Promise(function(resolve, reject) {
        const Http = new XMLHttpRequest()
        
        Http.open("POST", url)
        Http.setRequestHeader('Content-Type', 'application/json')

        Http.send(JSON.stringify(body))

        Http.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              const response = JSON.parse(Http.responseText)
              resolve(response)
            }
            else {
              reject(new Error("HTTP error " + this.status))
            }
          }
        }
      })
    }

    return {
      login,
      createAccount
    }
  }
}
</script>