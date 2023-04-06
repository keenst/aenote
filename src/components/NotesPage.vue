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
      :style="{ marginLeft: input.indentation + 'px' }"
      ref="inputElements"
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputs: [{ value: "", indentation: 0 }],
    };
  },
  methods: {
    createNewTextbox(index, event) {
      const value = event.target.value;
      const cursorPos = event.target.selectionStart;
      // split text into two parts at cursor position
      const firstPart = value.slice(0, cursorPos);
      const secondPart = value.slice(cursorPos);
      // Update the current input value to the first part
      this.inputs[index].value = firstPart;
      // insert new input after current one with second part as value
      this.inputs.splice(index + 1, 0, { value: secondPart });
      // focus on new input
      const newInputElement = this.$refs.inputElements[index + 1];
      newInputElement.focus();
      // set the cursor to start of new element after the component has finished updating
      setTimeout(() => {
        newInputElement.selectionStart = 0;
        newInputElement.selectionEnd = 0;
      }, 0);
      // indent 20px if tab 
      if (event.keyCode === 9) {
        newInputElement.style.marginLeft = "20px";
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
      const inputElement = this.$refs.inputElements[index];
      const currentMarginLeft = parseInt(inputElement.style.marginLeft) || 0;
      const indentationLevel = currentMarginLeft / pixels;
      const previousInputElement = this.$refs.inputElements[index - 1];
      const previousMarginLeft = parseInt(previousInputElement.style.marginLeft) || 0;
      const previousIndentationLevel = previousMarginLeft / pixels;
      // indent 20px if tab 
      if (indentationLevel < previousIndentationLevel + 1) {
        inputElement.style.marginLeft = `${currentMarginLeft + pixels}px`;
      }
      event.preventDefault();
    },

    unindentTextbox(index, event) {
      const inputElement = this.$refs.inputElements[index];
      const currentMarginLeft = parseInt(inputElement.style.marginLeft) || 0;

      if (event.keyCode === 8 && currentMarginLeft > 0 && inputElement.selectionStart === 0) {
        inputElement.style.marginLeft = `${currentMarginLeft - 20}px`;
      }
    },
  },
};
</script>