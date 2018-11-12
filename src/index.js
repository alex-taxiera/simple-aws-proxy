const express = require('express')
const proxy = require('http-proxy-middleware')
const requestIp = require('request-ip')
const cors = require('cors')

const {
  AWS_URL,
  AWS_API_KEY,
  PORT
} = process.env

const ips = Object.entries(process.env).reduce((list, [key, ip]) => (
  key.startsWith('IP') ? list.concat(ip) : list
), [])

const ipMiddleware = (req, res, next) => {
  const clientIp = requestIp.getClientIp(req)
  console.log('nani?', req.headers['x-forwarded-for'], req.connection.remoteAddress)

  if (!ips.includes(clientIp)) {
    console.log(`denied ip: ${clientIp}`)
    res.status(401)
  } else {
    console.log(`allowed ip: ${clientIp}`)
  }

  next()
}

const app = express()

app.use(cors())

app.use(ipMiddleware)

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
