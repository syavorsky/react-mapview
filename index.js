import {Component} from 'react'
import {findDOMNode} from 'react-dom'
import PropTypes from 'prop-types'
import {getAngle, getDistance, getCenter} from './util/touch'
import combineTranforms, {scale, rotate, translate} from './util/transform'

const SCALE_THRESHOLD = 0.15

class Mapview extends Component {
  constructor (...args) {
    super(...args)
    this.state = {transform: scale(this.props.scaleFactor)}
    this.center = [0, 0]
  }

  applyTransforms (...transforms) {
    const transform = combineTranforms(...transforms)
    this.setState({transform})
  }

  onTouchStart = e => {
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

  onTouchMove = e => {
    const transforms = []

    if (e.touches.length === 1) {
      transforms.push(translate(
        e.touches[0].pageX - this.startTouches[0].pageX,
        e.touches[0].pageY - this.startTouches[0].pageY
      ))
    } else if (e.touches.length === 2) {
      // const {minScale, maxScale} = this.props

      const angle = -1 * getAngle(...e.touches) - getAngle(...this.startTouches)
      const scaleFactor = getDistance(...e.touches) / getDistance(...this.startTouches)

      transforms.push(rotate(angle, ...this.center))

      if (Math.abs(scaleFactor - 1) > SCALE_THRESHOLD) {
        transforms.push(scale(scaleFactor, ...this.center))
      }
    }

    this.applyTransforms(this.startTransform, ...transforms)
  }

  onTouchEnd = e => {
    this.startTransform = this.state.transform
    this.startTouches = e.touches
    this.center = [0, 0]
    console.log('end', e.touches.length)
  }

  render () {
    return this.props.children({
      styles: {
        transformOrigin : '0 0 0',
        transform       : `matrix3d(${this.state.transform.join(',')})`
      },
      handlers: {
        onTouchStart : this.onTouchStart,
        onTouchMove  : this.onTouchMove,
        onTouchEnd   : this.onTouchEnd
      },
      center: this.center
    })
  }
}

Mapview.propTypes = {
  scaleFactor: PropTypes.number,
  children: PropTypes.func.isRequired
}

Mapview.defaultProps = {
  scaleFactor : 1
}

export default Mapview
