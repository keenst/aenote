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
    },

    createElement(parent, place) {
      // create the new element
      this.elements.push({
        "id": this.elements.length,
        "type": "text",
        "body": ""
      })

      // add the new element to the layout
      parent.children.splice(place, 0, {
        "id": this.elements.length - 1,
        "children": []
      })
    },

    findInFormat(id) {
      return findInArray(this.format, id)
    }
  }
})

function findInArray(array, id) {
  for (let i = 0; i < array.length; i++) {

    // if id matches, return object
    if (array[i].id == id) return array[i]

    if (array[i].children.length) {
      // loop through children of object
      let found = findInArray(array[i].children, id)
      if (found != null) return found
    }

    return null
  }
}