<template>
  <div>
    <ElementIterator :localFormat="store.format" :depth="0"/>
  </div>
</template>

<script>

import { useEditorStore } from '/src/stores/editor-store'
import ElementIterator from './ElementIterator.vue'

export default {
  components: {
    ElementIterator
  },
  setup() {
    const store = useEditorStore()
    store.readFromFile()

    return {
      store
    }
  }
}

</script>