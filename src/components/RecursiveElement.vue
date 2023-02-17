<template>
  <div v-for="(o, index) in this.format">
    {{ '&nbsp;'.repeat(this.depth * 4) }}
    <Element v-model:elements="this.elements" :index="index + parent" />
    <div v-if="o.children.length" v-for="(o2, index2) in o.children">
      <RecursiveElement 
        v-model:elements="this.elements" 
        :depth="this.depth + 1" 
        :format="this.format[index].children" 
        :parent="index + 1"
      />
    </div>
  </div>
</template>

<script>
import Element from './Element.vue'

export default {
  props: ['elements', 'depth', 'format', 'parent'],
  components: {
    Element
  }
}
</script>