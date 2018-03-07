const sharp = require('sharp')
const rgbHex = require('rgb-hex')
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

const getDominantColor = async image => {
  const { channels } = await sharp(image).stats()
  const [red, green, blue] = channels.map(c => c.mean)
  return '#' + rgbHex(red, green, blue)
}

const getImageInfo = async (url, errorHandler = console.error) => {
  try {
    const image = await getImage(url).catch(errorHandler)
    if (!image) return null
    const size = require('image-size')(image)
    if (!size) return null
    const { width, height } = size
    const base64 = await getTinyBase64(image).catch(errorHandler)
    if (!base64) return null
    const color = await getDominantColor(image).catch(errorHandler)

    return { url, base64, color, width, height }
  } catch (error) {
    errorHandler(error)
    return null
  }
}
module.exports = {
  getImage,
  getTinyBase64,
  getDominantColor,
  getImageInfo,
}
