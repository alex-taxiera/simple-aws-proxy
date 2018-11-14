const cors = require('cors')

const {
  store
} = require('./captcha')

const customCors = cors({
  origin: (origin, callback) => {
    if (store.isValid && store.host === origin) {
      callback(null, true)
    } else {
      callback(Error('Not allowed by CORS'))
    }
  }
})

module.exports = customCors
