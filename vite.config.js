import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectJsonPath = path.resolve(__dirname, 'projects.json')

function projectsApiPlugin() {
  return {
    name: 'projects-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/projects') {
          if (req.method === 'GET') {
            fs.readFile(projectJsonPath, 'utf8', (err, data) => {
              if (err) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Failed to read file' }))
              } else {
                res.setHeader('Content-Type', 'application/json')
                res.end(data)
              }
            })
            return
          }
          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body)
                fs.writeFile(projectJsonPath, JSON.stringify(parsed, null, 2), 'utf8', (err) => {
                  if (err) {
                    res.statusCode = 500
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ error: 'Failed to write file' }))
                  } else {
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ success: true, message: 'Projects updated successfully' }))
                  }
                })
              } catch (e) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Invalid JSON' }))
              }
            })
            return
          }
        }
        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), projectsApiPlugin()],
})
