const getMedia = require('getusermedia')
const recorder = require('media-recorder-stream')

const DEFAULT_OPTS = {
  audio: true,
  video: true,
  interval: 1000,
  mimeType: 'video/webm'
}

function createVideoReadStream (opts) {
  opts = Object.assign(DEFAULT_OPTS, opts)
  return new Promise((resolve, reject) => {
    getMedia(opts, (err, media) => {
      if (err) return reject(err)
      resolve(recorder(media, opts))
    })
  })
}

module.exports = createVideoReadStream
