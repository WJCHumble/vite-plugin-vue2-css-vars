## vite-plugin-vue2-css-vars

A vite plugin that allows you to use the CSS variable injection feature in **Vue 2.x** version.

## Usage

Install:

```bash
npm i vite-plugin-vue2-css-vars -D
```

Add the plugin to the `vite.config.ts`(or `vite.config.js`)，Note it must be add before `vite-plugin-vue2` plugin:

```javascript
import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import vitePluginVue2CssVars from "vite-plugin-vue2-css-vars";

export default defineConfig({
  plugins: [vitePluginVue2CssVars(), createVuePlugin()],
});
```

And then, you can use the params of `data` options in `style` by `v-bind` directive:

```html
<template>
  <div>
    <button @click="changeColor">change color</button>
    <div class="word">vue2</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        color: "blue",
      };
    },
    methods: {
      changeColor() {
        if (this.color === "red") {
          this.color = "black";
        } else {
          this.color = "red";
        }
      },
    },
  };
</script>

<style scoped vars>
  .word {
    background: v-bind(color);
  }
</style>
```
