<template>
  <div class="flex flex-row h-screen bg-gray-900 text-gray-100">
    <div class="w-1/6 border-r border-gray-700">
      <div 
      @click="$router.push('/editor')" 
      class="p-2 m-2 hover:bg-gray-800 rounded-md cursor-pointer">
        Editor
      </div>
      <div 
      @click="$router.push('/page1')" 
      class="p-2 m-2 hover:bg-gray-800 rounded-md cursor-pointer">
        Page 1
      </div>
      <div 
      @click="$router.push('/page2')" 
      class="p-2 m-2 bg-gray-700 rounded-md cursor-pointer">
        Page 2
      </div>
    </div>
    <div class="flex-grow flex flex-col justify-center items-center">
      <textarea class="w-3/5 h-3/5 px-4 py-2 rounded-md bg-gray-900 text-gray-100 focus:outline-none" 
      v-model="text" @keydown.tab.prevent="indentLine"
      ></textarea>
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

      if (start === end) {
        const value = this.text;
        const beforeCursor = value.substring(0, start);
        const afterCursor = value.substring(end);
        const newLineStart = beforeCursor.lastIndexOf('\n') + 1;
        const newLineEnd = beforeCursor.substring(newLineStart).search(/\S/) + newLineStart;
        const indent = ' '.repeat(4);
        if (newLineEnd === newLineStart - 1) {
          this.text = `${beforeCursor}${indent}• ${afterCursor}`;
          textarea.setSelectionRange(start + 4, start + 4);
        } else {
          const currentLine = beforeCursor.substring(newLineEnd);
          const isIndented = currentLine.startsWith('•');
          const newLine = `${indent}${isIndented ? '' : '•'}${currentLine.trim()}`;
          this.text = `${beforeCursor.substring(0, newLineEnd)}${newLine}${afterCursor}`;
          textarea.setSelectionRange(start + 4, start + 4);
        }
      }
      else {
        const value = this.text;
        const lines = value.substring(start, end).split('\n');
        const newLines = lines.map(line => {
          const isIndented = line.startsWith('•');
          const newLine = `${' '.repeat(4)}${isIndented ? line.substring(2).trim() : `•${line.trim()}`}`;
          return newLine;
        });
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
