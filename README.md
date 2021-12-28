# web-image-info

Checks if image exists, returns it's width, height and base64 thumbnail and it's
dominant color

- Works with both http & https images
- Follows redirects
- Uses _sharp_ for resizing (which is very fast)

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
const { getImageInfo } = require("web-image-info");
const info = await getImageInfo(
  "https://picsum.photos/200/300",
);
console.log(info);
/*
 Output:
 {
  url: 'https://picsum.photos/200/300',
  base64: 'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAgACADASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAABAUGAwf/xAArEAACAgEEAQIDCQAAAAAAAAABAgMRBAASITEFB1ETQWEGFRYiJnKCobH/xAAYAQACAwAAAAAAAAAAAAAAAAAEBgEFB//EACURAAEDAgQHAQAAAAAAAAAAAAIAAREDBBMhMVEFEjJBgaHR8f/aAAwDAQACEQMRAD8AzeHkRTz5MAilUoSEkYhUYjvm9Jxs+WXIyEmgaCVCFPxas+xBBo9aFj+PywFkEG6OQsyneOfzUe/nx/mkz4mTBU+THsE3Ccg3XZ4P1/rVFiZrQwICLkYs9kmQRzowZkBs8nknU9fht8a0O1Adp3AB6NGub12c7UJJYniq0FVZt4UWos9/XvUYsMiGoyvXPSSIfhrHDKzqpdQf5ajer8MP3v40nIWAJGxtuib61a9LI/0ug2ghZH7/AHHWa9ZUhTyGHagqI2brs8aIO4crcacd/v1LFtbs3EzMXjXxH4shOLiQrICrjllN3pKfZ3zDRb4fF+QlikAZGXGcqwPRBr21DhdpjEIDT0Kh20XBO2wb9yBVc2eq5TP56bHVFx/K5bBRtZBIwWOh8jfI5rj29uSMFGev0mOpcu2VN2nR5naV/9k=',
  color: '#b95a54',
  width: 200,
  height: 300
}
*/
```
