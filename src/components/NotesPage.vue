<template>
  <div v-for="(input, index) in inputs" :key="index">
    <input
      type="text"
      v-model="input.value"
      @keydown.enter.prevent="createNewTextbox(index, $event)"
      @keydown.down.prevent="focusNextTextbox(index)"
      @keydown.up.prevent="focusPreviousTextbox(index)"
      @keydown.tab.prevent="indentTextbox(index, 20, $event)"
      @keydown.backspace="unindentTextbox(index, $event)"
      @focus="newTextboxOnFocus(index)"
      :style="{ marginLeft: indentations[index] + 'px' }"
      ref="inputElements"
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputs: [{ value: "" }],
      indentations: [0],
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
    indentTextbox(index, pixels, event) {
      const currentIndentation = this.indentations[index];
      const previousIndentation = this.indentations[index - 1];
      // check if tab pressed and current indentation is less than maximum
      if (event.keyCode === 9 && currentIndentation < previousIndentation + pixels) {
        // increase indentation by 20px
        this.indentations[index] = currentIndentation + 20;
      }
    },
    unindentTextbox(index, event) {
      const currentIndentation = this.indentations[index];

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
    newTextboxOnFocus(index) {
      if (index === this.inputs.length - 1) {
        this.inputs.push({ value: "" });
        this.indentations.push(0);
      }
    },
  },
};
</script>