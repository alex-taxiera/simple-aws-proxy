function customOrigin (req, res, next) {
  let origin = req.headers.origin
  if (origin.startsWith('http')) {
    origin = origin.split('://')[1]
  }
  const parts = origin.split('.')
  if (parts.length > 2) {
    origin = parts[parts.length - 2] + '.' + parts[parts.length - 1]
  } else {
    origin = parts.join('.')
  }
  req.headers['origin'] = origin
  console.log(`[CuO] Modified origin: ${origin}`)
  next()
}

module.exports = customOrigin
