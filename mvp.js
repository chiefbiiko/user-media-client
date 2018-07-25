const getMedia = require('getusermedia')
const recorder = require('media-recorder-stream')

// Need to be specific for Blink regarding codecs
// alt: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
const MIME = 'video/webm'
const MIME_CODEC = `${MIME}; codecs="vorbis, vp8"`

function onmedia (video, sourceBuf, err, media) {
  if (err) throw err

  const readable = recorder(media, { interval: 1000, mimeType: MIME })
  readable.on('data', data => sourceBuf.appendBuffer(data))

  video.play()
  document.body.appendChild(video)
}

function onsourceopen (video, _) {
  const sourceBuf = this.addSourceBuffer(MIME_CODEC)
  getMedia({ video: true, audio: true }, onmedia.bind(null, video, sourceBuf))
}

function onload () {
  if (!/firefox/i.test(navigator.userAgent)) {
    throw new Error(`Unsupported browser: ${navigator.userAgent}`)
  } else if (!MediaSource.isTypeSupported(MIME_CODEC) ||
             !MediaRecorder.isTypeSupported(MIME)) {
    throw new Error(`Unsupported MIME type or codec: ${MIME_CODEC}`)
  }
  const video = document.createElement('video')
  const mediasource = new MediaSource()
  video.src = URL.createObjectURL(mediasource)
  mediasource.onsourceopen = onsourceopen.bind(mediasource, video)
}

window.onload = onload
