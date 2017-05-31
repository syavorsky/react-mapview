function prevent (el) {
  const stop = e => e.preventDefault()
  const options = {passive: false};

  ['touchstart', 'touchmove', 'touchend']
    .forEach(event => el.addEventListener(event, stop, options))
}

function getAngle (t0, t1) {
  return Math.atan2(
    (t1.clientY - t0.clientY) / 2,
    (t1.clientX - t0.clientX) / 2
  )
}

function getDistance (t0, t1) {
  return Math.sqrt(
    (t1.clientX - t0.clientX) ** 2 +
    (t1.clientY - t0.clientY) ** 2
  )
}

function getCenter (t0, t1) {
  return [
    t0.clientX + (t1.clientX - t0.clientX) / 2,
    t0.clientY + (t1.clientY - t0.clientY) / 2
  ]
}

function isCapable () {
  return (
    typeof document !== 'undefined' &&
    document.documentElement &&
    ('ontouchstart' in document.documentElement)
  )
}

export {prevent, getAngle, getDistance, getCenter, isCapable}
