const { Writable } = require('stream')

const DEFAULT_OPTS = {
  mimeCodec: 'video/webm; codecs="vorbis, vp8"'
}

function createVideoWriteStream (opts) {
  opts = Object.assign(DEFAULT_OPTS, opts)
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const mediasource = new MediaSource()
    video.src = URL.createObjectURL(mediasource)
    mediasource.onsourceopen = () => {
      const sourceBuf = this.addSourceBuffer(opts.mimeCodec)
      var initial = true
      const writable = new Writable({
        write (chunk, _, next) {
          sourceBuf.appendBuffer(chunk)
          if (initial) {
            video.play()
            initial = false
          }
          next(null)
        }
      })
      writable.video = video
      resolve(writable)
    }
  })
}

module.exports = createVideoWriteStream
