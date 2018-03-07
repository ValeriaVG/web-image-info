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
const getTinyBase64 = async (
  imageBuffer,
  h = 32,
  w = 32,
  errorHandler = console.error
) => {
  try {
    const buffer = await sharp(imageBuffer)
      .resize(h, w, {
        kernel: sharp.kernel.nearest,
      })
      .background('black')
      .embed()
      .toBuffer('JPG')

    return 'data:image/jpeg;base64,' + buffer.toString('base64')
  } catch (err) {
    errorHandler(err)
    return null
  }
}

const getDominantColor = async image => {
  const { channels } = await sharp(image).stats()
  const [red, green, blue] = channels.map(c => c.mean)
  return '#' + rgbHex(red, green, blue)
}

const getImageSize = async (image, errorHandler = console.error) => {
  try {
    const { width, height } = await sharp(image).metadata()
    return { width, height }
  } catch (err) {
    errorHandler(err)
    return {}
  }
}

const getImageInfo = async (url, errorHandler = console.error) => {
  try {
    const image = await getImage(url).catch(errorHandler)
    if (!image) return null
    const base64 = await getTinyBase64(image, 32, 32, errorHandler).catch(
      errorHandler
    )
    const color = await getDominantColor(image, errorHandler).catch(
      errorHandler
    )
    const size = await getImageSize(image, errorHandler).catch(errorHandler)
    return { url, base64, color, ...size }
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
  getImageSize,
}
