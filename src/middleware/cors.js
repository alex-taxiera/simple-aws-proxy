const cors = require('cors')

const {
  cleanOrigin
} = require('./helpers')

const {
  store
} = require('./captcha')

const customCors = cors({
  origin: (origin, callback) => {
    origin = cleanOrigin(origin)
    console.log('testing', store.isValid && store.host === origin)
    if (store.isValid && store.host === origin) {
      callback(null, true)
    } else {
      callback(Error('Not allowed by CORS'))
    }
  }
})

module.exports = customCors
