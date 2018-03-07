const {
  getImage,
  getTinyBase64,
  getImageInfo,
  getDominantColor,
  getImageSize,
} = require('../.')

describe('Image Info', () => {
  it('can check if image exists', async () => {
    const image = await getImage(
      'https://starflow.com/images/Valeria_Gusmao.jpg'
    )
    expect(image).toBeTruthy()
    try {
      const wrongImage = await getImage(
        'https://google.com/images/this_file_is_a_myth.jpg'
      )
      expect(wrongImage).toBeFalsy()
    } catch (error) {
      expect(error).toBe('Not Found')
    }

    const notSequreImage = await getImage(
      'http://starflow.com/images/Valeria_Gusmao.jpg'
    )
    expect(notSequreImage).toBeTruthy()
  })
  it('can get image buffer', async () => {
    const image = await getImage(
      'https://starflow.com/images/Valeria_Gusmao.jpg'
    )
    expect(Buffer.isBuffer(image)).toBe(true)
  })
  it('can get image size', async () => {
    const image = await getImage(
      'https://starflow.com/images/Valeria_Gusmao.jpg'
    )
    const { width, height } = await getImageSize(image)
    expect(width).toBe(2600)
    expect(height).toBe(2600)
  })
  it('can get image base64', async () => {
    const image = await getImage(
      'https://starflow.com/images/Valeria_Gusmao.jpg'
    )
    const base64 = await getTinyBase64(image, 32, 32)
    expect(base64).toBe(
      'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAgACADASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAUHAwYI/8QAIxAAAQMDBAMBAQAAAAAAAAAAAQIDBAAFERIhMUEGBxOB8P/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDyqa2gxlzJTcdrGtw4GeKwpjZXfg+t5C9DraSps6Qd+uaBp5R4bdfHIcaXOQlUaRsh1s5Tq50nsH+6OOaq3exZUZ31/LQ9cTJR9o5iNhCdKHCnKgFJG+305PWBjuI0BTKxR2JM9tuTKbioJGXHOAP3altFBQPZl7gS4FstcB8SFRsqWtpWGUjGEpSBsTyc9ZxnkCf0UUH/2Q=='
    )
    const smallerBase64 = await getTinyBase64(image)
    expect(smallerBase64).toBe(
      'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAABAUGCP/EACMQAAICAQMEAwEAAAAAAAAAAAECAxEEAAUSBiExURMUQfD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AyzjoJciND4ZgD30/652PG2LcsWHDaYxT44m4zFSynkynupqjwseDRFi9T+O6xzxvInyIrAsl1yHq/wA0d1Bu0u87h9iRFiREWKKJSSI41FBbP96odtB//9k='
    )
  })
  it('can return it all', async () => {
    const info = await getImageInfo(
      'https://starflow.com/images/Valeria_Gusmao.jpg'
    )
    expect(info).toMatchSnapshot()
    const info2 = await getImageInfo('https://starflow.com/images/app-2.png')
    expect(info2).toMatchSnapshot()
  })
  it('doesnt throw on connection error', async () => {
    const info = await getImageInfo(
      'http://localhost:6000/images/Valeria_Gusmao.jpg'
    )
    expect(info).toBeNull()
  })
})
