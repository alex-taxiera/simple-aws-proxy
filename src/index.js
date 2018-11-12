const express = require('express')
const proxy = require('http-proxy-middleware')
const cors = require('cors')

const {
  AWS_URL,
  AWS_API_KEY,
  PORT
} = process.env

const domains = Object.entries(process.env).reduce((list, [key, domain]) => (
  key.startsWith('DOMAIN') ? list.concat(domain) : list
), [])

const corsOptions = {
  origin: (origin, callback) => {
    if (domains.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const app = express()

app.use(cors(corsOptions))

app.use('/proxy', proxy({
  target: AWS_URL,
  changeOrigin: true,
  pathRewrite: { '^/proxy': '' },
  onProxyReq: (proxyReq, req, socket, options, head) => {
    proxyReq.setHeader('x-api-key', AWS_API_KEY)
  }
}))

app.listen(PORT, () => console.log(`listening on port: ${PORT}`))
