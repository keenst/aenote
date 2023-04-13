<template>
  <button @click="this.setNotes()">Load</button>
  <button @click="saveNotes()">Save</button>
  <div class="flex flex-row">
    <!-- Sidebar -->
    <div class="bg-gray-600 w-36 h-screen">
      <div v-for="(note, index) in notes" :key="index" class="bg-gray-700">
        <div @click="this.setNote(index)">
          {{ index }}
        </div>
      </div>
      <div @click="this.createNote()">+</div>
    </div>
    <!-- Editor -->
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
          :style="{ marginLeft: inputs[index].indentation + 'px' }"
          ref="inputElements"
          class="bg-gray-100"
        >
      </div>
    </div>
  </div>
</template>


<script>

import { useUserStore } from '../stores/userStore'
import { ref, reactive } from 'vue'

export default {
  data() {
    return {
      inputs: reactive([{ value: "", indentation: 0 }]),
      notes: reactive([])
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

    async function loadNotes() {
      return new Promise(function(resolve, reject) {
        const http = new XMLHttpRequest()
        const url = "http://localhost:1337/users/" + user_id + "/notes/"

        http.open("GET", url)
        http.send()

        http.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              const response = JSON.parse(http.responseText)
              resolve(response)
            } else {
              reject(new Error("HTTP error " + http.status))
            }
          }
        }
      })
    }

    return {
      loadNotes,
      user_id
    }
  },
  methods: {
    createNewTextbox(index, event) {
      const value = event.target;
      const cursorPos = event.target.selectionStart;
      // split text into two parts at cursor position
      const firstPart = value.slice(0, cursorPos);
      const secondPart = value.slice(cursorPos);
      const currentIndentation = this.inputs[index].indentation;
      this.inputs[index].value = firstPart;
      this.inputs.splice(index + 1, 0, { value: secondPart, indentation: currentIndentation });
      // focus on new input
      const newInputElement = this.$refs.inputElements[index + 1];
      newInputElement.focus();
      // set cursor to start of new element after component has finished updating (janky jank jank)
      setTimeout(() => {
        newInputElement.selectionStart = 0;
        newInputElement.selectionEnd = 0;
      }, 0);
      // set the same indentation as the focused input
      //this.indentations.splice(index + 1, 0, currentIndentation);
      // indent 20px if tab 
      if (event.keyCode === 9) {
        this.inputs[index + 1].indentaton = currentIndentation + 20;
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
      const currentIndentation = this.inputs[index].indentation;
      const previousIndentation = this.inputs[index - 1].indentation;
      // check if tab pressed and current indentation is less than maximum and shift is not pressed
      if (event.keyCode === 9 && !event.shiftKey && currentIndentation < previousIndentation + pixels) {
        // increase indentation by 20px
        this.inputs[index].indentation = currentIndentation + 20;
        // loop through child textboxes and indent them as well
        for (let i = index + 1; i < this.inputs.length; i++) {
          const childIndentation = this.inputs[i].indentation;
          if (childIndentation <= currentIndentation) {
            break;
          }
          this.inputs[i].indentation += 20;
          const inputElement = this.$refs.inputElements[i];
          inputElement.style.marginLeft = `${this.inputs[i].indentation}px`;
        }
      }
    },
    unindentTextboxOnBackspace(index, event) {
      const currentIndentation = this.inputs[index].indentation;
      // checks if start of textbox
      if (event.keyCode === 8 && currentIndentation > 0 && this.$refs.inputElements[index].selectionStart === 0) {
        this.inputs[index].indentation = currentIndentation - 20;
        let nextIndex = index + 1;
        // loop through nextindex until it is same or less than current indentation, then unindent all of them
        while (nextIndex < this.inputs.length && this.inputs[nextIndex].indentation > currentIndentation) {
          this.inputs[nextIndex].indentation = this.inputs[nextIndex].indentation - 20;
          nextIndex++;
        }
      }
    },
    unindentTextboxOnShiftTab(index, event) {
      const currentIndentation = this.inputs[index].indentation;
      if (event.keyCode === 9 && event.shiftKey && currentIndentation > 0) {
        this.inputs[index].indentation = currentIndentation - 20;
        let nextIndex = index + 1;
        while (nextIndex < this.inputs.length && this.inputs[nextIndex].indentation > currentIndentation) {
          this.inputs[nextIndex].indentation = this.inputs[nextIndex].indentation - 20;
          nextIndex++;
        }
      }
    },
    newTextboxOnFocus(index) {
      if (index === this.inputs.length - 1) {
        this.inputs.push({ value: "", indentation: 0 });
      }
    },
    async setNote(index) {
      this.inputs = this.notes[index].content
    },
    async setNotes() {
      try {
        this.notes = await this.loadNotes()
      } catch (error) {
        console.error("Error loading notes:", error)
      }
    },
    async saveNotes() {
      this.notes.forEach(note => {
        const http = new XMLHttpRequest()
        const url = "http://localhost:1337/notes/" + note._id.$oid

        http.open("PATCH", url)
        http.setRequestHeader("content-type", "application/json")
        
        const body = { content: note.content }

        http.send(JSON.stringify(body))

        http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            console.log(http.responseText)
          }
        }
      });
    },
    async createNote() {
      const http = new XMLHttpRequest()
      const url = "http://localhost:1337/notes/"

      http.open("POST", url)
      http.setRequestHeader("content-type", "application/json")
      
      const body = { content: {}, owner_id: { $oid: this.user_id } }
      console.log(body)
      console.log(JSON.stringify(body))

      http.send(JSON.stringify(body))

      const self = this
      http.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
          await self.setNotes()
          await self.setNote(self.notes.length - 1)
        }
      }
    }
  },
};
</script>