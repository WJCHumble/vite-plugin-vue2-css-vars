<template>
  <div>
    <button @click="changeColor">click me</button>
    <div v-for="(item, index) in 10000" :key="index" class="word">vue</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      color: "red"
    }
  },
  methods: {
    changeColor() {
      if (this.color === "red") {
        this.color = "black" 
      } else {
        this.color = "red"
      }
    }
  }
}
</script>

<style scoped>
.word {
  background: v-bind(color)
}
</style>