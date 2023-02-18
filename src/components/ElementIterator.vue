<template>
  <div v-for="item in localFormat">
    {{ "&nbsp;".repeat(depth == 0 ? 0 : (depth * 4) - 1) }}
    <Element :id="item.id"/>
    <div v-if="item.children.length" v-for="item2 in item.children">
      <ElementIterator :localFormat="item.children" :depth="depth + 1"/>
    </div>
  </div>
</template>

<script>

import { useEditorStore } from '/src/stores/editor-store'
import Element from './Element.vue'

export default {
  props: ['localFormat', 'depth'],
  components: {
    Element
  },
  setup(props) {
    const store = useEditorStore()

    return {
      store
    }
  }
}

</script>