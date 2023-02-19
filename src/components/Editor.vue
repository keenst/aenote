<template>
  <div>
    <ElementIterator :localFormat="store.format" :depth="0" :parentId="0"/>
  </div>
</template>

<script>

import { reactive } from 'vue'
import { useEditorStore } from '/src/stores/editor-store'
import ElementIterator from './ElementIterator.vue'

export default {
  components: {
    ElementIterator
  },
  setup() {
    const state = reactive({
      store: null
    })

    state.store = useEditorStore()
    state.store.readFromFile()

    return {
      store: state.store
    }
  }
}

</script>