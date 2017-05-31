const prevent = e => e.preventDefault()
const options = {passive: false}

function noScroll (el) {
  el.addEventListener('touchstart', prevent, options)
  el.addEventListener('touchmove', prevent, options)
  el.addEventListener('touchend', prevent, options)
  el.addEventListener('scroll', prevent)
}

export {noScroll}
