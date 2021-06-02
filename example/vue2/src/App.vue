<template>
  <div>
    <button @click="changeColor">change color</button>
    <button @click="changeColor2">change color2</button>
    <div class="word">vue2 <p>vue3</p></div>
    <HelloWorld/>
    <van-button type="primary">primary button</van-button>
  </div>
</template>

<script>
import HelloWorld from "../components/HelloWord.vue"

export default {
  components: {
    HelloWorld
  },
  data() {
    return {
      color: "blue",
      color2: "#faa"
    }
  },
  methods: {
    changeColor() {
      if (this.color === "red") {
        this.color = "black" 
      } else {
        this.color = "red"
      }
    },
    changeColor2() {
      if (this.color2 === "#faa") {
        this.color2 = "#aaf" 
      } else {
        this.color2 = "#faa"
      }
    },
  }
}
</script>

<style scoped lang="less" vars>
.word {
  background: v-bind(color);

  p {
    background: v-bind(color2);
  }
}
</style>