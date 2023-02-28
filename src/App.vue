<template>
  <RouterView/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import IndentedTextArea from './components/Editor.vue';

export default defineComponent({
  name: 'App',

  components: {
    IndentedTextArea,
  },

  setup() {
    const text = ref('');

    return {
      text,
    };
  }
});
</script>


