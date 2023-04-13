<template>
  <button @click="this.inputs = setNote()">Load</button>
  <button @click="saveNote(this.inputs)">Save</button>
  <div class="bg-gray-800 text-cyan-200"> fasfasf
    <div v-for="(input, index) in inputs" :key="index" class="bg-gray-800">
      <input
        type="text"
        v-model="input.value"
        @keydown.enter.prevent="createNewTextbox(index, $event)"
        @keydown.down.prevent="focusNextTextbox(index)"
        @keydown.up.prevent="focusPreviousTextbox(index)"
        @keydown.tab.prevent="indentTextbox(index, 20, $event)"
        @keydown.backspace="unindentTextboxOnBackspace(index, $event)"
        @keydown.shift.tab.prevent="unindentTextboxOnShiftTab(index, $event)"
        @focus="newTextboxOnFocus(index)"
        :style="{ marginLeft: indentations[index] + 'px' }"
        ref="inputElements"
        class="bg-gray-100"
      >
    </div>
  </div>
</template>


<script>

import { useUserStore } from '../stores/userStore'
import { ref, reactive } from 'vue'

export default {
  data() {
    return {
      inputs: reactive([{ value: "" }]),
      indentations: [0],
    };
  },
  setup() {
    const store = useUserStore()

    console.log("ID:", store.user_id)

    const user_id = store.user_id.$oid
    if (user_id == null) {
      console.log("User is not logged in!")
      return
    }

    const http = new XMLHttpRequest()
    const url = "http://localhost:1337/users/" + user_id + "/notes/"
    
    http.open("GET", url)
    http.send()

    var firstNoteContent = ref([])
    var firstNoteId
    var note

    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const response = JSON.parse(http.responseText)
        firstNoteContent.value = response[0].content
        firstNoteId = response[0]._id.$oid
        //console.log(firstNoteContent)
      }
    }

    async function saveNote(note) {
      const http = new XMLHttpRequest()
      const url = "http://localhost:1337/notes/" + firstNoteId

      console.log(url)

      http.open("PATCH", url)
      http.setRequestHeader("content-type", "application/json")
      
      const body = { content: note }
      console.log(body)

      http.send(JSON.stringify(body))

      http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          console.log(http.responseText)
          console.log(note)
        }
      }
    }

    async function loadNote() {
      return new Promise(function(resolve, reject) {
        const http = new XMLHttpRequest()
        const url = "http://localhost:1337/users/" + user_id + "/notes/"

        http.open("GET", url)
        http.send()
        
        var content

        http.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              const response = JSON.parse(http.responseText)
              const content = response[0].content
              resolve(content)
            } else {
              reject(new Error("HTTP error " + http.status))
            }
          }
        }
      })
    }

    return {
      firstNoteContent,
      saveNote,
      loadNote
    }
  },
  methods: {
    createNewTextbox(index, event) {
      const value = event.target;
      const cursorPos = event.target.selectionStart;
      // split text into two parts at cursor position
      const firstPart = value.slice(0, cursorPos);
      const secondPart = value.slice(cursorPos);
      const currentIndentation = this.indentations[index];
      this.inputs[index].value = firstPart;
      this.inputs.splice(index + 1, 0, { value: secondPart });
      // focus on new input
      const newInputElement = this.$refs.inputElements[index + 1];
      newInputElement.focus();
      // set cursor to start of new element after component has finished updating (janky jank jank)
      setTimeout(() => {
        newInputElement.selectionStart = 0;
        newInputElement.selectionEnd = 0;
      }, 0);
      // set the same indentation as the focused input
      this.indentations.splice(index + 1, 0, currentIndentation);
      // indent 20px if tab 
      if (event.keyCode === 9) {
        this.indentations[index + 1] = currentIndentation + 20;
      }
    },
    focusNextTextbox(index) {
      if (index < this.inputs.length - 1) {
        const nextInputElement = this.$refs.inputElements[index + 1];
        nextInputElement.focus();
      }
    },
    focusPreviousTextbox(index) {
      if (index > 0) {
        const previousInputElement = this.$refs.inputElements[index - 1];
        previousInputElement.focus();
      }
    },
    // use this one for indenting one line at a time:

    // indentTextbox(index, pixels, event) {
    //   const currentIndentation = this.indentations[index];
    //   const previousIndentation = this.indentations[index - 1];
    //   // check if tab pressed and current indentation is less than maximum and shift is not pressed
    //   if (event.keyCode === 9 && !event.shiftKey && currentIndentation < previousIndentation + pixels) {
    //     // increase indentation by 20px
    //     this.indentations[index] = currentIndentation + 20;
    //   }
    // },
    indentTextbox(index, pixels, event) {
      const currentIndentation = this.indentations[index];
      const previousIndentation = this.indentations[index - 1];
      // check if tab pressed and current indentation is less than maximum and shift is not pressed
      if (event.keyCode === 9 && !event.shiftKey && currentIndentation < previousIndentation + pixels) {
        // increase indentation by 20px
        this.indentations[index] = currentIndentation + 20;
        // loop through child textboxes and indent them as well
        for (let i = index + 1; i < this.inputs.length; i++) {
          const childIndentation = this.indentations[i];
          if (childIndentation <= currentIndentation) {
            break;
          }
          this.indentations[i] += 20;
          const inputElement = this.$refs.inputElements[i];
          inputElement.style.marginLeft = `${this.indentations[i]}px`;
        }
      }
    },
    unindentTextboxOnBackspace(index, event) {
      const currentIndentation = this.indentations[index];
      // checks if start of textbox
      if (event.keyCode === 8 && currentIndentation > 0 && this.$refs.inputElements[index].selectionStart === 0) {
        this.indentations[index] = currentIndentation - 20;
        let nextIndex = index + 1;
        // loop through nextindex until it is same or less than current indentation, then unindent all of them
        while (nextIndex < this.indentations.length && this.indentations[nextIndex] > currentIndentation) {
          this.indentations[nextIndex] = this.indentations[nextIndex] - 20;
          nextIndex++;
        }
      }
    },
    unindentTextboxOnShiftTab(index, event) {
      const currentIndentation = this.indentations[index];
      if (event.keyCode === 9 && event.shiftKey && currentIndentation > 0) {
        this.indentations[index] = currentIndentation - 20;
        let nextIndex = index + 1;
        while (nextIndex < this.indentations.length && this.indentations[nextIndex] > currentIndentation) {
          this.indentations[nextIndex] = this.indentations[nextIndex] - 20;
          nextIndex++;
        }
      }
    },
    newTextboxOnFocus(index) {
      // console.log("getting length, inputs:", this.inputs)
      // console.log(this.inputs.length)
      // console.log(this.inputs.value)
      // console.log("trying setting")
      // this.inputs = [{value: "test"}]
      // console.log(this.inputs.value)
      // console.log(this.inputs)
      // console.log("tried setting")
      if (index === this.inputs.length - 1) {
        this.inputs.push({ value: "" });
        this.indentations.push(0);
      }
    }
  },
};
</script>