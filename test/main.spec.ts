import { transformMain } from "../src/main"

describe('transformMain', () => {
	const shortId = "data-v-7ba5bd90"
	const fileName = "App.vue"
	const baseSFC = `
<template>
  <div>
    <button @click="changeColor">change color</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      color: "blue",
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
`.trim()

	test("should work when use vars attr in style", async () => {
		const sfc = `
${baseSFC}

<style scoped lang="less" vars>
.word {
	background: v-bind(color);

	p {
		background: v-bind(color2);
	}
}
</style>	
`
		const isProd = false
		const res = await transformMain(sfc, fileName, shortId, isProd)
		expect(res?.code).toMatchSnapshot()
	})

	test("In prod mode, will not generate cssVarsCode for css comment code when have vars attr in style without write v-bind() code", async () => {
		const sfc = `
${baseSFC}

<style scoped lang="less" vars>
.word {
	// background: v-bind(color);

	// p {
	// 	background: v-bind(color2);
	// }
}
</style>	
`
		const isProd = true
		const res = await transformMain(sfc, fileName, shortId, isProd)
		expect(res?.code).toMatchSnapshot()
	})

	test("In dev mode, will auto inject cssVarsCode when use vars attr in style without v-bind() code", async () => {
		const sfc = `
${baseSFC}

<style scoped lang="less" vars>
.word {
	// background: v-bind(color);

	// p {
	// 	background: v-bind(color2);
	// }
}
</style>	
`
		const isProd = false
		const res = await transformMain(sfc, fileName, shortId, isProd)
		expect(res?.code).toMatchSnapshot()
	})
})