<template>
  <input 
    @keydown="$event => onTyping($event)" 
    type="text" 
    :value="localBody"
  />
  <button @click="log">Log</button>
</template>

<script>

import { ref, onMounted, reactive } from 'vue'
import { useEditorStore } from '/src/stores/editor-store'

export default {
  props: ['id', 'parentId'],
  setup(props) {
    const element = ref("")
    const store = useEditorStore()
    const localBody = ref("")
    
    onMounted(() => {
      // TODO: replace timeout with something faster and more consistent
      setTimeout(() => {
        element.value = store.elements.find(o => o.id == props.id).body
        localBody.value = element.value
      }, 200)
    })

    function onTyping(event) {
      //console.log(event)

      // if the key pressed is enter
      if (event.key == "Enter") {
        console.log(props.parentId)
        store.createElement(store.findInFormat(props.parentId), 0)
        return
      }

      // set the element's body in the store
      store.setBody(props.id, localBody.value)
    }

    function log() {
      console.log(localBody.value)
      console.log(store.elements.find(o => o.id == props.id))
    }

    return {
      localBody,
      onTyping,
      log,
      element
    }
  }
}

</script>