import { defineStore } from 'pinia'

export const useEditorStore = defineStore({
  id: 'editor',
  state: () => ({
    elements: [],
    format: []
  }),
  actions: {
    readFromFile() {
      Promise.all([
        fetch("/ids.json")
          .then(response => response.json())
          .then(data => {
            this.elements = data
          }),
        fetch("/format.json")
          .then(response => response.json())
          .then(data => {
            this.format = data
          })
      ])
    },
    setBody(index, value) {
      this.elements[index].body = value
    }
  }
})