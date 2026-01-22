import http from "http"
import { getSystemInfo } from "./system-utils.js"

const PORT = 3000

const server = http.createServer(async (req, res) => {
  const url = req.url

  if (url === "/api/system") {
    const data = await getSystemInfo()
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(data, null, 2))
    return
  }

  if (url === "/api/time") {
    const now = new Date()
    const timeData = {
      iso: now.toISOString(),
      unix: Math.floor(now.getTime() / 1000),
      local: now.toLocaleString()
    }
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(timeData, null, 2))
    return
  }

  // Route: /
  if (url === "/") {
    const html = `
      <html>
        <head><title>Node.js System API</title></head>
        <body>
          <h1>Welcome to Node.js API</h1>
          <p>Available endpoints:</p>
          <ul>
            <li><a href="/api/system">/api/system</a></li>
            <li><a href="/api/time">/api/time</a></li>
          </ul>
        </body>
      </html>
    `
    res.writeHead(200, { "Content-Type": "text/html" })
    res.end(html)
    return
  }

  res.writeHead(404, { "Content-Type": "text/plain" })
  res.end("404 Not Found")
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
