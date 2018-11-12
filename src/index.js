const express = require('express')
const proxy = require('http-proxy-middleware')
const {
  IpFilter,
  IpDeniedError
} = require('express-ipfilter')
const cors = require('cors')

const {
  AWS_URL,
  AWS_API_KEY,
  PORT
} = process.env

const ips = Object.entries(process.env).reduce((list, [key, ip]) => (
  key.startsWith('IP') ? list.concat(ip) : list
), [])

const app = express()

app.use(cors())

app.use(IpFilter(ips, { mode: 'allow' }))

app.use((error, req, res, next) => {
  if (error instanceof IpDeniedError) {
    res.status(401)
  } else {
    res.status(error.status || 500)
  }

  next(error)
})

app.use('/proxy', proxy({
  target: AWS_URL,
  changeOrigin: true,
  pathRewrite: { '^/proxy': '' },
  onProxyReq: (proxyReq, req, socket, options, head) => {
    proxyReq.setHeader('x-api-key', AWS_API_KEY)
  }
}))

app.listen(PORT, () => console.log(`listening on port: ${PORT}`))
