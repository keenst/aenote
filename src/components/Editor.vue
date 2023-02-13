<template>
    <div>
      <p v-for="(id, index) in formattedIds" :key="index">
        {{ id.body }} id:{{ id.id }} type:{{ id.type }}
      </p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        ids: [],
        format: []
      };
    },
    computed: {
      formattedIds() {
        return this.format.map(id => {
          return this.ids.find(i => i.id === id);
        });
      }
    },
    created() {
      Promise.all([
        fetch("/ids.json")
          .then(response => response.json())
          .then(data => {
            this.ids = data;
          }),
        fetch("/format.json")
          .then(response => response.json())
          .then(data => {
            this.format = data;
          })
      ]);
    }
  };
  </script>
  