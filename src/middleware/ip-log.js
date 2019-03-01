const requestIp = require('request-ip')

function ipLog (req, res, next) {
  const ip = requestIp.getClientIp(req)
  console.log(`[IPL] Requester ip: ${ip}`)
  next()
}

module.exports = ipLog
