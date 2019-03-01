function originLog (req, res, next) {
  const origin = req.headers.origin
  console.log(`[OgL] Requester origin: ${origin}`)
  next()
}

module.exports = originLog
