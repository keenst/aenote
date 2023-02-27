<template>
  <div class="flex flex-row h-screen bg-gray-900 text-gray-100">
    <div class="w-1/4 border-r border-gray-700">
      <div class="p-4">Sidebar Content</div>
      <div class="p-4">Sidebar Content</div>
      <div class="p-4">Sidebar Content</div>
    </div>
    <div class="flex-grow flex flex-col justify-center items-center">
      <textarea class="w-1/2 h-64 px-4 py-2 rounded-md bg-gray-800 text-gray-100 focus:outline-none" v-model="text" @keydown.tab.prevent="indentLine"></textarea>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      text: '',
    };
  },
  methods: {
    indentLine(event: KeyboardEvent) {
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // If no text is selected, insert four spaces at the start of the line
      if (start === end) {
        const value = this.text;
        const beforeCursor = value.substring(0, start);
        const afterCursor = value.substring(end);
        const newLineStart = beforeCursor.lastIndexOf('\n') + 1;
        const newLineEnd = beforeCursor.substring(newLineStart).search(/\S/) + newLineStart;
        const indent = ' '.repeat(4);
        if (newLineEnd === newLineStart - 1) {
          this.text = `${beforeCursor}${indent}${afterCursor}`;
          textarea.setSelectionRange(start + 4, start + 4);
        } else {
          this.text = `${beforeCursor.substring(0, newLineEnd)}${indent}${beforeCursor.substring(newLineEnd)}${afterCursor}`;
          textarea.setSelectionRange(start + 4, start + 4);
        }
      }
      // If text is selected, indent each line of the selection
      else {
        const value = this.text;
        const lines = value.substring(start, end).split('\n');
        const newLines = lines.map(line => `    ${line}`);
        const newValue = `${value.substring(0, start)}${newLines.join('\n')}${value.substring(end)}`;
        this.text = newValue;
        const newStart = start + 4;
        const newEnd = end + newLines.join('\n').length - lines.join('\n').length + 4;
        textarea.setSelectionRange(newStart, newEnd);
      }
    },
  },
});
</script>