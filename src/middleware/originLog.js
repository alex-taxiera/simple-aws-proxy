function originLog (req, res, next) {
  const origin = req.headers.origin
  console.log(`[COM] Requester origin: ${origin}`)
  next()
}

module.exports = originLog
