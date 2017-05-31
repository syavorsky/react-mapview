function prevent (el) {
  const stop = e => e.preventDefault()
  const options = {passive: false};

  ['touchstart', 'touchmove', 'touchend']
    .forEach(event => el.addEventListener(event, stop, options))
}

function getAngle (t0, t1) {
  return Math.atan2(
    (t1.pageY - t0.pageY) / 2,
    (t1.pageX - t0.pageX) / 2
  )
}

function getDistance (t0, t1) {
  return Math.sqrt(
    (t1.pageX - t0.pageX) ** 2 +
    (t1.pageY - t0.pageY) ** 2
  )
}

function getCenter (t0, t1) {
  return [
    t0.pageX + (t1.pageX - t0.pageX) / 2,
    t0.pageY + (t1.pageY - t0.pageY) / 2
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
