<template>
  <div v-for="item in localFormat">
    {{ "&nbsp;".repeat(depth == 0 ? 0 : (depth * 4) - 1) }}
    <Element :id="item.id" :parentId="parentId"/>
    <div v-if="item.children.length">
      <ElementIterator :localFormat="item.children" :depth="depth + 1" :parentId="item.id"/>
    </div>
  </div>
</template>

<script>

import { useEditorStore } from '/src/stores/editor-store'
import Element from './Element.vue'

export default {
  props: ['localFormat', 'depth', 'parentId'],
  components: {
    Element
  },
  setup(props) {
    const store = useEditorStore()

    setTimeout(() => {
      //console.log(props.localFormat)
    }, 200)

    return {
      store
    }
  }
}

</script>