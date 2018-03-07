# web-image-info

Checks if image exists, returns it's width, height and base64 thumbnail and it's dominant color

* Works with both http & https images
* Rejects with response statusMessage if image is not available
* Uses _sharp_ for resizing (which is very fast)

## Installation

```
yarn add web-image-info
```

OR

```
npm -i web-image-info
```

## Use

```js
const {getImageInfo } = require('web-image-info')
const info = await getImageInfo(
      'https://starflow.com/images/Valeria_Gusmao.jpg'
    )
console.log(info)
/*
 Output:
 {
  "base64": "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAABAUGCP/EACMQAAICAQMEAwEAAAAAAAAAAAECAxEEAAUSBiExURMUQfD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AyzjoJciND4ZgD30/652PG2LcsWHDaYxT44m4zFSynkynupqjwseDRFi9T+O6xzxvInyIrAsl1yHq/wA0d1Bu0u87h9iRFiREWKKJSSI41FBbP96odtB//9k=",
  "color": "#0b0b0b",
  "height": 2600,
  "url": "https://starflow.com/images/Valeria_Gusmao.jpg",
  "width": 2600,
}
*/
```
