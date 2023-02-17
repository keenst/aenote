<template>
  <div>
    <RecursiveElement 
      v-model:elements="this.elements" 
      :depth="0" 
      :format="this.format" 
      :parent="0" 
    />
    <button @click="log()">Log</button>
  </div>
</template>

<script>
import RecursiveElement from './RecursiveElement.vue'

export default {
  data() {
    return {
      elements: [],
      format: []
    };
  },
  components: {
    RecursiveElement
  },
  methods: {
    log() {
      console.log(this.elements)
    }
  },
  created() {
    Promise.all([
      fetch("/ids.json")
        .then(response => response.json())
        .then(data => {
          this.elements = data
        }),
      fetch("/format.json")
        .then(response => response.json())
        .then(data => {
          this.format = data
        })
    ])
  },
}
</script>
