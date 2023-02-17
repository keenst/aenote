<template>
  <div v-for="(o, index) in this.format">
    {{ '&nbsp;'.repeat(this.depth * 4) }}
    <input type="text" v-model="this.elements[index + this.parent].body">
    <div v-if="o.children.length" v-for="(o2, index2) in o.children">
      <Element 
        v-model:elements="this.elements" 
        :depth="this.depth + 1" 
        :format="this.format[index].children" 
        :parent="index + 1"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['elements', 'depth', 'format', 'parent']
}
</script>