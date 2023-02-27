<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex items-center justify-between bg-gray-200 px-4 py-2">
      <h1 class="text-lg font-semibold">Vue Text Editor</h1>
      <button class="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-1" @click="save">Save</button>
    </div>
    <textarea
      class="flex-1 bg-white text-gray-700 p-4 text-sm resize-none outline-none border-2 border-gray-300 rounded-t-md rounded-b-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50"
      v-model="text"
      @keydown.tab.prevent="indent"
    ></textarea>
    <div class="bg-gray-200 p-4 text-gray-700 text-sm rounded-b-md">
      <p>Example text with Tailwind CSS classes:</p>
      <ul class="list-disc ml-4 mt-2">
        <li class="font-bold text-red-500">This is a bullet point with a red bold title</li>
        <li class="mt-2">This is another bullet point</li>
        <li class="mt-2">Here is a <span class="underline">link</span> to Google</li>
      </ul>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      text: "",
    };
  },
  methods: {
    indent(event) {
      const textarea = this.$refs.textarea;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (event.shiftKey) {
        // If Shift key is pressed, remove one level of indentation
        const selectedText = this.text.substring(start, end);
        const lines = selectedText.split("\n");
        const unindentedText = lines.map((line) =>
          line.startsWith("\t•") ? line.substr(2) : line.startsWith("\t") ? line.substr(1) : line
        ).join("\n");
        this.text =
          this.text.substring(0, start) + unindentedText + this.text.substring(end);
        textarea.selectionStart = start;
        textarea.selectionEnd = end - (selectedText.length - unindentedText.length);
      } else {
        // If Shift key is not pressed, add one level of indentation
        if (start === end) {
          // If no text is selected, insert a tab character and bullet point
          this.text =
            this.text.substring(0, start) +
            "\t• " +
            this.text.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        } else {
          // If text is selected, indent each line and add bullet point
          const selectedText = this.text.substring(start, end);
          const lines = selectedText.split("\n");
          const indentedText = lines
            .map((line) => "\t• " + line.trimStart())
            .join("\n");
          this.text =
            this.text.substring(0, start) +
            indentedText +
            this.text.substring(end);
          textarea.selectionStart = start;
          textarea.selectionEnd =
            end + (indentedText.length - selectedText.length);
        }
      }
    },
  },
  watch: {
    text() {
      // Indent lines based on the indentation level of the previous line
      this.text = this.text
        .split("\n")
        .map((line, index, lines) => {
          if (line.startsWith("\t")) {
            // If the line is already indented, preserve the indentation
            return line;
          } else if (index > 0 && lines[index - 1].startsWith("\t")) {
            // If the previous line is indented, indent this line the same amount
            const indentLevel = lines[index - 1].match(/^\t+/)[0].length;
            return "\t".repeat(indentLevel) + line;
          } else {
            // Otherwise, do not indent the line
            return line;
          }
        })
        .join("\n");

      // Add bullet points to lines that start with a bullet point marker (•)
      this.text = this.text
        .split("\n")
        .map((line) => {
          if (line.startsWith("\t•")) {
            // If the line already has a bullet point, preserve it
            return line;
          } else if (line.trim().startsWith("•")) {
            // If the line starts with a bullet point, add an indent and preserve the bullet point
            return "\t•" + line.trim().substr(1);
          }
          else {
            return line;
          }
        })
        .join("\n");
    },
  },
};
<script/>