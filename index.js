import {Component} from 'react'
import t from 'prop-types'
import {getAngle, getDistance, getCenter} from './util/touch'
import combineTranforms, {scale, rotate, translate, toCss} from './util/transform'

function getTransformProp (props) {
  const {transform} = props
  if (Array.isArray(transform)) {
    return transform.sice(0, 6)
  } else if (transform) {
    return combineTranforms(
      scale(transform.scale),
      translate(transform.translate[0], transform.translate[1]),
      -1 * transform.rotate * Math.PI / 180
    )
  } else {
    return scale(1)
  }
}

class Mapview extends Component {
  constructor (...args) {
    super(...args)
    const {transform} = this.props

    this.center = [0, 0]

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)

    this.state = {transform: getTransformProp(this.props)}
  }

  componentWillReceiveProps (nextProps) {
    this.setState({transform: getTransformProp(nextProps)})
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
    this.center = e.touches.length > 1 ? getCenter(...e.touches) : [0, 0]
    console.log('touch start')
  }

  onTouchMove (e) {
    const transforms = []

    if (e.touches.length === 1) {
      transforms.push(translate(
        e.touches[0].clientX - this.startTouches[0].clientX,
        e.touches[0].clientY - this.startTouches[0].clientY
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
    console.log('touch end')
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
