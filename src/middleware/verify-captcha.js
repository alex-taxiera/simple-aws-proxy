const request = require('superagent')
const requestIp = require('request-ip')

const {
  RECAPTCHA_SECRET
} = process.env

const verifyCaptcha = async (req, res, next) => {
  const token = req.headers['recaptcha-token']
  const ip = requestIp.getClientIp(req)

  try {
    if (!token) {
      return res.status(403).json({ error: 'ReCaptcha failed: Please provide response token' })
    }
    const response = await request
      .post('https://www.google.com/recaptcha/api/siteverify')
      .query({ secret: RECAPTCHA_SECRET })
      .query({ response: token })
      .query({ remoteip: ip })

    const {
      success,
      score,
      action
    } = response.body
    if (!success || score < 0.5 || action !== 'contact') {
      console.log('bad', response.body)
      return res.status(403).json({ error: 'ReCaptcha failed' })
    } else {
      next()
    }
  } catch (error) {
    console.log(`[REC] ReCaptcha failed: ${error.message}`)
    res.status(500).json({ error: 'ERROR DURING RECAPTCHA VERIFICATION' })
  }
}

module.exports = verifyCaptcha
