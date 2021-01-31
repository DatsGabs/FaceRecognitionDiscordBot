const faceapi = require('face-api.js')
const canvas = require('canvas')
const path = require('path')

const { Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

const faceDetectionNet = faceapi.nets.ssdMobilenetv1

const weights = path.join(__dirname, 'weights')

module.exports = async function (url) {
  await faceDetectionNet.loadFromDisk(path.join(__dirname, 'weights'))
  await faceapi.nets.faceLandmark68Net.loadFromDisk(weights)
  await faceapi.nets.ageGenderNet.loadFromDisk(weights)

  const image = await canvas.loadImage(url)
  const detections = await faceapi
    .detectAllFaces(image)
    .withFaceLandmarks()
    .withAgeAndGender()

  const out = faceapi.createCanvasFromMedia(image)

  // Draw to the image
  faceapi.draw.drawDetections(out, detections)
  faceapi.draw.drawFaceLandmarks(
    out,
    detections.map((res) => res.landmarks)
  )
  detections.forEach((result) => {
    const { gender } = result
    new faceapi.draw.DrawTextField(
      [`${gender}`],
      result.detection.box.bottomLeft
    ).draw(out)
  })
  // Save file
  return out.toBuffer('image/jpeg')
}
