const path = require("path")
const esbuild = require("esbuild")
const pkg = require("../package.json")

async function run()
{
	await esbuild.build({
		entryPoints: [path.join(__dirname, "..", "src", "mainWindowWeb.js")],
		bundle: true,
		platform: "browser",
		format: "iife",
		globalName: "KmpEditorWeb",
		target: "es2020",
		outfile: path.join(__dirname, "app.js"),
		sourcemap: true,
		define: {
			__APP_VERSION__: JSON.stringify(pkg.version)
		}
	})

	console.log("Built web/app.js")
}

run().catch((err) =>
{
	console.error(err)
	process.exit(1)
})
