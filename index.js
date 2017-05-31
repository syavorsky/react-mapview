import {Component} from 'react'
import {findDOMNode} from 'react-dom'
import t from 'prop-types'
import {getAngle, getDistance, getCenter} from './util/touch'
import combineTranforms, {scale, rotate, translate, toCss} from './util/transform'

class Mapview extends Component {
  constructor (...args) {
    super(...args)
    const {transform} = this.props

    this.center = [0, 0]

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)

    let initialTransform

    if (Array.isArray(transform)) {
      initialTransform = transform.sice(0, 6)
    } else if (transform) {
      initialTransform = combineTranforms(
        scale(transform.scale),
        translate(transform.translate[0], transform.translate[1]),
        -1 * transform.rotate * Math.PI / 180
      )
    } else {
      initialTransform = scale(1)
    }

    this.state = {transform: initialTransform}
  }

  applyTransforms (...transforms) {
    const {onTransform} = this.props
    const transform = combineTranforms(...transforms)

    if (onTransform) return onTransform(transform)
    this.setState({transform})
  }

  onTouchStart (e) {
    this.startTransform = this.state.transform
    this.startTouches = e.touches

    if (e.touches.length > 1) {
      const {left, top} = findDOMNode(this).getBoundingClientRect()
      const center = getCenter(...e.touches)
      this.center = [center[0] + left, center[1] + top]
    } else {
      this.center = [0, 0]
    }
  }

  onTouchMove (e) {
    const transforms = []

    if (e.touches.length === 1) {
      transforms.push(translate(
        e.touches[0].pageX - this.startTouches[0].pageX,
        e.touches[0].pageY - this.startTouches[0].pageY
      ))
    } else if (e.touches.length === 2) {
      // const {minScale, maxScale} = this.props

      const angle = -1 * (getAngle(...e.touches) - getAngle(...this.startTouches))
      const scaleFactor = getDistance(...e.touches) / getDistance(...this.startTouches)

      transforms.push(rotate(angle, ...this.center))
      transforms.push(scale(scaleFactor, ...this.center))
    }

    this.applyTransforms(this.startTransform, ...transforms)
  }

  onTouchEnd (e) {
    this.startTransform = this.state.transform
    this.startTouches = e.touches
    this.center = [0, 0]
    console.log('end', e.touches.length)
  }

  onScroll (e) {
    console.log(e)
  }

  render () {
    return this.props.children({
      styles: {
        transformOrigin: '0 0 0',
        transform: toCss(this.state.transform)
      },
      handlers: {
        onTouchStart: this.onTouchStart,
        onTouchMove: this.onTouchMove,
        onTouchEnd: this.onTouchEnd
      },
      center: this.center
    })
  }
}

Mapview.propTypes = {
  children: t.func.isRequired,
  onTransform: t.func,
  transform: t.oneOfType([
    t.array,
    t.shape({
      rotate: t.number.isRequired,
      scale: t.number.isRequired,
      translate: t.arrayOf(t.number).isRequired
    }).isRequired
  ])
}

Mapview.defaultProps = {
  transform: null,
  onTransform: null
}

export default Mapview
