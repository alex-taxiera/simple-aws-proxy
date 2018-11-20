const express = require('express')
const helmet = require('helmet')
const proxy = require('http-proxy-middleware')

const {
  ipLog,
  originLog,
  captcha,
  cors
} = require('./middleware')

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
app.use(captcha.getCaptcha)
app.use(cors)

app.use('/proxy/recaptcha', captcha.verifyCaptcha, proxyWare)
app.use('/proxy/nocaptcha', proxyWare)

app.listen(PORT, () => console.log(`[LOG] Listening on port: ${PORT}`))
