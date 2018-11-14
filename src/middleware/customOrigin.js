function customOrigin (req, res, next) {
  let host = req.headers.host
  const parts = host.split('.')
  if (parts.length > 2) {
    host = parts[parts.length - 2] + '.' + parts[parts.length - 1]
  } else {
    host = parts.join('.')
  }
  req.headers['origin'] = host
  console.log(`[CuO] Modified origin: ${host}`)
  next()
}

module.exports = customOrigin
