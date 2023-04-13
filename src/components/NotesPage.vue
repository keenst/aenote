<template>
  <div class="bg-ae-grey-700 px-80 py-14">
    <div class="bg-ae-grey-500 h-full w-full px-20 py-16">
      <div v-for="(input, index) in inputs" :key="index"> 
        <div class="relative">
          <div class="absolute h-4 w-4 bg-ae-grey-700 top-[+4px] left-[-20px]"  @click="TEMPhandleClick"></div>
          <textarea
            class="bg-ae-grey-300 text-ae-white font-mono w-full max-w-full h-6 resize-none justify-center mb-0 pl-6"
            type="text"
            v-model="input.value"
            @keydown.enter.prevent="createNewTextbox(index, $event)"
            @keydown.down.prevent="focusNextTextbox(index)"
            @keydown.up.prevent="focusPreviousTextbox(index)"
            @keydown.tab.prevent="indentTextbox(index, 30, $event)"
            @keydown.backspace="handleBackspacePress(index, $event)"
            @keydown.shift.tab.prevent="unindentTextboxOnShiftTab(index, $event)"
            @focus="newTextboxOnFocus(index)"
            :style="{ marginLeft: indentations[index] + 'px', maxWidth: 'calc(100% - ' + indentations[index] + 'px)' }"
            ref="inputElements"
          >
          </textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//           @keydown.tab.prevent="indentTextbox(index, 20, $event); squarePositions[index].left += 30"
export default {
  data() {
    return {
      inputs: [{ value: "" }],
      indentations: [0],
      maxWidth: 400
    };
  },
  methods: {
    createNewTextbox(index, event) {
      const value = event.target.value;
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
      // indent 30px if tab 
      if (event.keyCode === 9) {
        this.indentations[index + 1] = currentIndentation + 30;
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
    //     // increase indentation by 30px
    //     this.indentations[index] = currentIndentation + 30;
    //   }
    // },
    indentTextbox(index, pixels, event) {
      const currentIndentation = this.indentations[index];
      const previousIndentation = this.indentations[index - 1];
      // check if tab pressed and current indentation is less than maximum and shift is not pressed
      if (event.keyCode === 9 && !event.shiftKey && currentIndentation < previousIndentation + pixels) {
        // increase indentation by 30px
        this.indentations[index] = currentIndentation + 30;
        // loop through child textboxes and indent them as well
        for (let i = index + 1; i < this.inputs.length; i++) {
          const childIndentation = this.indentations[i];
          if (childIndentation <= currentIndentation) {
            break;
          }
          this.indentations[i] += 30;
          const inputElement = this.$refs.inputElements[i];
          inputElement.style.marginLeft = `${this.indentations[i]}px`;
        }
      }
    },
    handleBackspacePress(index, event) {
      const currentIndentation = this.indentations[index];
      // checks if start of textbox
      if (event.keyCode === 8 && currentIndentation > 0 && this.$refs.inputElements[index].selectionStart === 0) {
        this.indentations[index] = currentIndentation - 30;
        let nextIndex = index + 1;
        // loop through nextindex until it is same or less than current indentation, then unindent all of them
        while (nextIndex < this.indentations.length && this.indentations[nextIndex] > currentIndentation) {
          this.indentations[nextIndex] = this.indentations[nextIndex] - 30;
          nextIndex++;
        }
      }
    },
    unindentTextboxOnShiftTab(index, event) {
      const currentIndentation = this.indentations[index];
      if (event.keyCode === 9 && event.shiftKey && currentIndentation > 0) {
        this.indentations[index] = currentIndentation - 30;
        let nextIndex = index + 1;
        while (nextIndex < this.indentations.length && this.indentations[nextIndex] > currentIndentation) {
          this.indentations[nextIndex] = this.indentations[nextIndex] - 30;
          nextIndex++;
        }
      }
    },
    newTextboxOnFocus(index) {
      if (index === this.inputs.length - 1) {
        this.inputs.push({ value: "" });
        this.indentations.push(0);
      }
    },
    TEMPhandleClick() {
      console.log('Div clicked!');
    },
  },
};
</script>