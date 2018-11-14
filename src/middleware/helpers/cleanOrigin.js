function cleanOrigin (origin) {
  if (origin.startsWith('http')) {
    origin = origin.split('://')[1]
  }
  const parts = origin.split('.')
  if (parts.length > 2) {
    origin = parts[parts.length - 2] + '.' + parts[parts.length - 1]
  } else {
    origin = parts.join('.')
  }
  return origin
}

module.exports = cleanOrigin
