import { message } from 'antd'

export function validateImageFile(file) {
  // validate file extension
  const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i
  if (!allowedExtensions.exec(file.name)) {
    message.error('Invalid file type. Please choose a valid image file (JPG, JPEG, PNG, GIF).')
    return false
  }
  return true
}
export function getDisplayInfo(label, file) {
  return `${label} - ${readableBytes(file.size)}`
}
function readableBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const size = `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
  return size
}

const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject
  })

export async function processImage(oldImage, callback, lblInfoRef) {
  if (oldImage.size < 10240) {
    const result = await toBase64(oldImage)
    lblInfoRef.current.innerText = getDisplayInfo('Original File', oldImage)
    callback(result)
    return
  }
  // reduce image size if > 10KB, use it as value and thumbnail
  const img = new Image()
  img.src = URL.createObjectURL(oldImage)
  img.onerror = () => {
    message.error('Failed to load the image. It might be corrupted or invalid.')
    URL.revokeObjectURL(img.src)
  }
  img.onload = () => {
    lblInfoRef.current.innerText = getDisplayInfo('Original File', oldImage)
    const resizedImage = compressImage(img, MIME_TYPE, lblInfoRef)
    callback(resizedImage)
  }
}
const MAX_WIDTH = 100
const MAX_HEIGHT = 100
const MIME_TYPE = 'image/jpeg'
const QUALITY = 1
function compressImage(img, fileType, lblInfoRef) {
  const canvas = document.createElement('canvas')
  let { width, height } = img
  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > MAX_WIDTH) {
      height = Math.round((height *= MAX_WIDTH / width))
      width = MAX_WIDTH
    }
  } else if (height > MAX_HEIGHT) {
    width = Math.round((width *= MAX_HEIGHT / height))
    height = MAX_HEIGHT
  }

  // resize the canvas and draw the image data into it
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)
  canvas.toBlob(
    blob => {
      lblInfoRef.current.innerText += `\n ${getDisplayInfo('Compressed File', blob)}`
    },
    MIME_TYPE,
    QUALITY,
  )

  // get the data from canvas as 70% jpg (or specified type).
  return canvas.toDataURL(fileType, QUALITY)
}

export default processImage
