<template>
  <input type="text" v-model="this.elements[this.index].body">
</template>

<script>
export default {
  props: ['index', 'elements']
}
</script>