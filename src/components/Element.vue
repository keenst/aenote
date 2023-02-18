<template>
  <input @input="editElement" type="text" v-model="localBody">
  <button @click="log">Log</button>
</template>

<script>

import { ref, onMounted } from 'vue'
import { useEditorStore } from '/src/stores/editor-store'

export default {
  props: ['id'],
  setup(props) {
    const element = ref("")
    const store = useEditorStore()
    const localBody = ref("")

    onMounted(() => {
      // TODO: replace timeout with something faster and more consistent
      setTimeout(() => {
        element.value = store.elements[props.id].body
        localBody.value = element.value
      }, 200)
    })

    function editElement() {
      store.setBody(props.id, localBody.value)
    }

    function log() {
      console.log(localBody.value)
      console.log(store.elements[props.id])
    }

    return {
      localBody,
      editElement,
      log
    }
  }
}

</script>