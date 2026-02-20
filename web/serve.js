const http = require("http")
const fs = require("fs")
const path = require("path")

const port = Number(process.env.PORT || 4173)
const root = __dirname

const mimeTypes = {
	".html": "text/html; charset=utf-8",
	".js": "application/javascript; charset=utf-8",
	".map": "application/json; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".svg": "image/svg+xml",
	".ico": "image/x-icon"
}

function send(res, code, body, type)
{
	res.writeHead(code, {
		"Content-Type": type,
		"Cache-Control": "no-store"
	})
	res.end(body)
}

http.createServer((req, res) =>
{
	let reqPath = decodeURIComponent((req.url || "/").split("?")[0])
	if (reqPath === "/")
		reqPath = "/index.html"

	const filePath = path.normalize(path.join(root, reqPath))
	if (!filePath.startsWith(root))
	{
		send(res, 403, "Forbidden", "text/plain; charset=utf-8")
		return
	}

	fs.readFile(filePath, (err, data) =>
	{
		if (err)
		{
			send(res, 404, "Not Found", "text/plain; charset=utf-8")
			return
		}

		const ext = path.extname(filePath).toLowerCase()
		send(res, 200, data, mimeTypes[ext] || "application/octet-stream")
	})
}).listen(port, () =>
{
	console.log(`Web app running at http://localhost:${port}`)
})
