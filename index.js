const sharp = require('sharp')
const getImage = async url => {
  const isSecure = /^https:/.test(url)
  const protocol = isSecure ? require('https') : require('http')
  return new Promise((resolve, reject) => {
    protocol
      .get(url, response => {
        let chunks = []
        if (response.statusCode >= 400) return reject(response.statusMessage)
        response
          .on('data', chunk => {
            chunks.push(chunk)
          })
          .on('end', () => {
            const buffer = Buffer.concat(chunks)
            resolve(buffer)
          })
      })
      .on('error', error => {
        reject(error)
      })
  })
}
const getTinyBase64 = (imageBuffer, h = 16, w = 16) => {
  return new Promise((resolve, reject) => {
    sharp(imageBuffer)
      .resize(h, w, {
        kernel: sharp.kernel.nearest,
      })
      .background('black')
      .embed()
      .toBuffer('JPG')
      .then(buffer => {
        resolve('data:image/jpeg;base64,' + buffer.toString('base64'))
      })
  })
}
const getImageInfo = async (url, errorHandler = console.error) => {
  try {
    const image = await getImage(url).catch(errorHandler)
    if (!image) return null
    const size = require('image-size')(image)
    const base64 = await getTinyBase64(image)
    return { url, base64, ...size }
  } catch (error) {
    errorHandler(error)
    return null
  }
}
module.exports = {
  getImage,
  getTinyBase64,
  getImageInfo,
}
