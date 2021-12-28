const {
  getImage,
  getTinyBase64,
  getImageInfo,
  getDominantColor,
  getImageSize,
} = require('../.')

const imageURL = "https://i.picsum.photos/id/869/200/200.jpg?hmac=Eqnjw4kAS1sFTick74KSN6CBN01wmQg8OpxqbGtdyCU"

describe('Image Info', () => {
  it('can check if image exists', async () => {
    const image = await getImage(
      imageURL
    )
    expect(image).toBeTruthy()
    expect(await getImage('http://picsum.photos/200/300')).toBeTruthy()
    await expect(getImage(
      'https://google.com/images/this_file_is_a_myth.jpg')).
      rejects.toMatchInlineSnapshot(`"Not Found"`)
  })
  it('can get dominant color', async () => {
    const image = await getImage(
      imageURL
    )
    expect(image).toBeTruthy()
    const color = await getDominantColor(image)
    expect(color).toBe('#333b4a')
    await expect(getDominantColor(Buffer.from([]))).rejects.toMatchInlineSnapshot(`[Error: Input Buffer is empty]`)
  })
  it('can get image buffer', async () => {
    const image = await getImage(
      imageURL
    )
    expect(Buffer.isBuffer(image)).toBe(true)
  })

  it('can get image size', async () => {
    const image = await getImage(
      'https://picsum.photos/200/300'
    )
    expect(image).toBeTruthy()
    const { width, height } = await getImageSize(image)
    expect(width).toBe(200)
    expect(height).toBe(300)
    const img = await getImage(
      imageURL
    )
    expect(img).toBeTruthy()
    const meta = await getImageSize(img)
    expect(meta).toMatchInlineSnapshot(`
Object {
  "height": 200,
  "width": 200,
}
`)
  })

  it('can get image base64', async () => {
    const image = await getImage(
      imageURL
    )
    const base64 = await getTinyBase64(image, 32, 32)
    expect(base64).toMatchInlineSnapshot(`"data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAgACADASIAAhEBAxEB/8QAGgAAAQUBAAAAAAAAAAAAAAAABgECAwUHBP/EACkQAAEEAQIFAgcAAAAAAAAAAAEAAgMRBCEyBRIxQVEU4SJSYXGRobH/xAAXAQADAQAAAAAAAAAAAAAAAAACAwQF/8QAGxEBAAMAAwEAAAAAAAAAAAAAAQACEQMjQSH/2gAMAwEAAhEDEQA/AMdmwmVbTd9fomeiAF1+leQQxvGrbCU4pbsojxS0sJBV8g87DUbsYN7IjOPJW3X+qGTDJOoQuRgMhweJNczmc1zQNNaVgMxnUuA7AVuPgflBOfFJkfDHOYoiK5AwHt5XHFwsgnmynkEfL7qO1uRMGVVpxjqbNJx82NoLwWnsdbo17pxzcYCn0HIEgjbDjvhBc5r95cd33TuYhgaNGjoAh7PWM68+E//Z"`)
    const smallerBase64 = await getTinyBase64(image, 16, 16)
    expect(smallerBase64).toMatchInlineSnapshot(`"data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAMH/8QAIxAAAgEDAQkAAAAAAAAAAAAAAQIDABEhBQQGEhUiUXGBof/EABUBAQEAAAAAAAAAAAAAAAAAAAME/8QAGREAAgMBAAAAAAAAAAAAAAAAAAECAyFB/9oADAMBAAIRAxEAPwDKeVq44wose1Rk0rF1U+xRo9b2mEiNYBKAMu0gUE+KYu8UixqrQqTbPVcD5VTvXEDGjNZ//9k="`)
    await expect(getTinyBase64(Buffer.from([]), 32, 32)).rejects.toMatchInlineSnapshot(`[Error: Input Buffer is empty]`)
  })
  it('can return it all', async () => {
    const info = await getImageInfo(
      imageURL
    )
    expect(info).toMatchSnapshot()
    const info2 = await getImageInfo('https://i.picsum.photos/id/315/200/300.jpg?hmac=C67WPcnxkaV_SPowHi-8nl3yoODZSBZqnoOdBObP5Ys')
    expect(info2).toMatchSnapshot()

    const info3 = await getImageInfo(
      'https://i.picsum.photos/id/135/200/200.jpg?hmac=uaxfwtA3aJhzzHN36hg2MJi5Rl8nbuqAsipKDDj2seU'
    )
    expect(info3).toBeTruthy()
    expect(info3).toMatchSnapshot()
  })
  it('throw on connection error', async () => {
    await expect(getImageInfo(
      'http://localhost:6000/images/img.jpg')).
      rejects.toMatchInlineSnapshot(`[Error: connect ECONNREFUSED 127.0.0.1:6000]`)
  })
  it('throw on too many redirects', async () => {
    jest.mock('http', () => {
      return {
        get: (url, cb) => {
          cb({
            statusCode: 301,
            headers: {
              location: url
            },
          })
          return { on: () => { }, }
        }
      }
    })
    await expect(getImageInfo(
      'http://localhost:6000/images/img.jpg')).
      rejects.toMatchInlineSnapshot(`"Too many redirect"`)
  })
})
