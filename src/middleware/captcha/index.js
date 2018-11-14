const request = require('superagent')

const {
  AWS_URL,
  AWS_API_KEY
} = process.env

class ReCaptcha {
  set ({ host, sitekey, secret } = {}) {
    this.host = host
    this.sitekey = sitekey
    this.secret = secret
    if (host && sitekey && secret) {
      this.isValid = true
    }
  }

  request (origin) {
    return request
      .get(AWS_URL + `/admin/recaptcha-keys/${origin}`)
      .set('x-api-key', AWS_API_KEY)
      .then((res) => {
        this.set(res.body)
        return true
      })
  }

  async verify (token, ip) {
    if (!token) {
      throw Error('Please provide response token')
    }
    return request
      .post('https://www.google.com/recaptcha/api/siteverify')
      .query({ secret: this.secret })
      .query({ response: token })
      .query({ remoteip: ip })
      .then((res) => {
        if (!res.success) {
          throw Error('Google says no')
        } else {
          return res
        }
      })
  }
}

function getCaptcha (req, res, next) {
  store.request(req.headers.origin)
    .then((res) => next())
    .catch((res) => next())
}

function verifyCaptcha (req, res, next) {
  store.verify(req.headers['recaptcha-token'])
    .then((res) => {
      console.log(res)
      next()
    })
    .catch((error) => {
      console.log(`[REC] ReCaptcha failed: ${error.message}`)
    })
}

const store = new ReCaptcha()

module.exports = {
  store,
  getCaptcha,
  verifyCaptcha
}
