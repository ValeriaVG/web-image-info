const sharp = require('sharp')
/**
 * Fetches image buffer from URL
 * @param {string} url 
 * @param {number} attempt to limit redirects level 
 * @returns {Buffer}
 */
const getImage = async (url, attempt = 0) => {
  const isSecure = /^https:/.test(url)
  const protocol = isSecure ? require('https') : require('http')
  return new Promise((resolve, reject) => {
    protocol
      .get(url, response => {
        if (response.statusCode >= 400) return reject(response.statusMessage)
        if (response.statusCode >= 300 && response.headers.location) {
          if (attempt > 10) return reject('Too many redirect')
          return getImage(response.headers.location, ++attempt).then(resolve, reject)
        }
        let chunks = []
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
/**
 * 
 * @param {Buffer} imageBuffer 
 * @param {number} h 
 * @param {number} w 
 * @returns {string}
 */
const getTinyBase64 = async (
  imageBuffer,
  h = 32,
  w = 32,
) => {
  const buffer = await sharp(imageBuffer)
    .resize(h, w, {
      kernel: sharp.kernel.nearest,
    })
    .toBuffer('JPG')

  return 'data:image/jpeg;base64,' + buffer.toString('base64')
}

/**
 * Returns dominant color from the image
 * @param {Buffer} image 
 * @returns {Promise<string>}
 */
const getDominantColor = async image => {
  const { channels } = await sharp(image).stats()
  const [red, green, blue] = channels.map(c => c.mean)
  return '#' + [red, green, blue].map(v => {
    const hex = Math.round(v).toString(16)
    if (hex.length == 1) return '0' + hex
    return hex
  }).join('')
}

/**
 * Returns image size
 * @param {Buffer} image 
 * @returns {Promise<{width?:number,height?:number}>}
 */
const getImageSize = async (image) => {
  const { width, height } = await sharp(image).metadata()
  return { width, height }
}

/**
 * Returns combined image information
 * @param {string} url 
 * @returns {Promise<{url:string,base64:string,color:string,width:number,height:number}>}
 */
const getImageInfo = async (url) => {
  const image = await getImage(url)
  if (!image || !image.length) return {}
  const base64 = await getTinyBase64(image, 32, 32)
  const color = await getDominantColor(image)
  const size = await getImageSize(image)
  return { url, base64, color, ...size }
}
module.exports = {
  getImage,
  getTinyBase64,
  getDominantColor,
  getImageInfo,
  getImageSize,
}
