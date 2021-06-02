## vite-plugin-vue2-css-vars

一个可以让你在 Vue 2.x 版本使用 **CSS 变量注入**特性的 Vite 插件。

## Usage

安装:

```bash
npm i vite-plugin-vue2-css-vars -D
```

将 `vite-plugin-vue2-css-vars` 插件添加到 `vite.config.ts`（或者 `vite.config.js`），注意该插件必须添加在 `vite-plugin-vue2` 插件之前：

```javascript
import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import vitePluginVue2CssVars from "vite-plugin-vue2-css-vars";

export default defineConfig({
  plugins: [vitePluginVue2CssVars(), createVuePlugin()],
});
```

然后，你可以在 SFC（单文件组件）的 `<style>` 中通过 `v-bind()` 指令使用 `data` 选项的参数：

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
