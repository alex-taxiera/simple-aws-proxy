const express = require('express')
const helmet = require('helmet')
const proxy = require('http-proxy-middleware')
const cors = require('cors')

const ipLog = require('./middleware/ip-log')
const originLog = require('./middleware/origin-log')
const verifyCaptcha = require('./middleware/verify-captcha')

const {
  AWS_URL,
  AWS_API_KEY,
  PORT
} = process.env

const app = express()

const proxyWare = proxy({
  target: AWS_URL,
  changeOrigin: true,
  pathRewrite: { '^/proxy': '' },
  headers: { 'x-api-key': AWS_API_KEY }
})

app.use(helmet())

app.use(ipLog)
app.use(originLog)
app.use(cors())

app.use('/proxy/recaptcha', verifyCaptcha, proxyWare)
app.use('/proxy', proxyWare)

app.listen(PORT, () => console.log(`[LOG] Listening on port: ${PORT}`))
