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

app.use(helmet())

app.use(ipLog)
app.use(originLog)
app.use(captcha.getCaptcha)
app.use(cors)
app.use(captcha.verifyCaptcha)

app.use('/proxy/user', proxy({
  target: AWS_URL,
  changeOrigin: true,
  pathRewrite: { '^/proxy': '' },
  headers: { 'x-api-key': AWS_API_KEY }
}))

app.listen(PORT, () => console.log(`[LOG] Listening on port: ${PORT}`))
