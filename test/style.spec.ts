import { transformStyle } from "../src/style"

describe("transformStyle", () => {
	const shortId = "data-v-7ba5bd90"

	test("style block transform", async() => {
		const styleBlock = `
.word {
	background: v-bind(color);

	p {
		background: v-bind(color2);
	}
}		
`.trim()

		const {code} = await transformStyle(styleBlock, shortId)
		expect(code).toMatchSnapshot()
	})

	test("will not rewrite v-bind() for css comment", async() => {
		const styleBlock = `
.word {
	// background: v-bind(color);

	// p {
	// 	background: v-bind(color2);
	// }
}		
`.trim()

	const {code} = await transformStyle(styleBlock, shortId)
	expect(code).toMatchSnapshot()
	})
})