<template>
  <div class="bg-red-500">
    <p>this should have a red background</p>
  </div>
  <div class="bg-ae-grey-300">
    <p>this should have a grey background</p>
  </div>
    <div>
        <p v-for="body in this.formatted">
            {{ body }}
        </p>
    </div>
</template>


<script>
export default {
data() {
    return {
        elements: [],
        formatted: []
    };
},
methods: {
    iterateFormat(json, iteration) {
        for (var object of json) {
            var element = this.elements.find(o => o.id == object.id)
            var body = element.body
            this.formatted.push('>'.repeat(iteration) + body)

            if (object.children.length == 0) continue

            this.iterateFormat(object.children, iteration + 1)
        }
    }
},
created() {
    Promise.all([
        fetch("/ids.json")
            .then(response => response.json())
            .then(data => {
                this.elements = data
            }),
        fetch("/format.json")
            .then(response => response.json())
            .then(data => {
                this.iterateFormat(data, 0)
            })
    ])
},
}
</script>
