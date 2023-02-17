<template>
  <div>
    <element 
      v-model:elements="this.elements" 
      :depth="0" 
      :format="this.format" 
      :parent="0" 
    />
    <button @click="log()">Log</button>
  </div>
</template>

<script>
import element from './Element.vue'

export default {
data() {
  return {
    elements: [],
    format: []
  };
},
components: {
  element
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
