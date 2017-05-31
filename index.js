import {Component} from 'react'
import {findDOMNode} from 'react-dom'
import t from 'prop-types'
import {getAngle, getDistance, getCenter, isCapable} from './util/touch'
import combineTranforms, {scale, rotate, translate, toCss} from './util/transform'

function getTransformProp (props) {
  const {transform} = props

  if (Array.isArray(transform)) {
    return transform.slice(0, 16)
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
    this.isTouchEnabled = isCapable()

    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)

    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onWheel = this.onWheel.bind(this)
    this.onDoubleClick = this.onDoubleClick.bind(this)

    this.state = {transform: getTransformProp(this.props)}
  }

  componentWillReceiveProps (nextProps) {
    this.setState({transform: getTransformProp(this.props)})
  }

  componentDidMount () {
    this.isTouchEnabled = isCapable()
  }

  applyTransforms (...transforms) {
    const transform = combineTranforms(...transforms)

    if (this.props.onTransform) return onTransform(transform)
    this.setState({transform})
  }

  // ----- mobile -----

  onTouchStart (e) {
    console.log('touch start')
    this.dragging = true
    this.startTransform = this.state.transform
    this.startTouches = e.touches
    this.center = e.touches.length > 1 ? getCenter(...e.touches) : [0, 0]
  }

  onTouchMove (e) {
    const transforms = []

    if (e.touches.length === 1) {
      this.applyTransforms(this.startTransform, translate(
        e.touches[0].clientX - this.startTouches[0].clientX,
        e.touches[0].clientY - this.startTouches[0].clientY
      ))
    } else if (e.touches.length === 2) {
      const angle = -1 * (getAngle(...e.touches) - getAngle(...this.startTouches))
      const scaleFactor = getDistance(...e.touches) / getDistance(...this.startTouches)

      this.applyTransforms(this.startTransform,
        rotate(angle, ...this.center),
        scale(scaleFactor, ...this.center)
      )
    }
  }

  onTouchEnd (e) {
    console.log('touch end')
    this.dragging = false
    this.startTransform = this.state.transform
    this.startTouches = e.touches
    this.center = [0, 0]
  }

  // ----- desktop -----

  onMouseDown (e) {
    console.log('drag start')
    this.dragging = true
    this.startTransform = this.state.transform
    this.startPos = {
      clientX: e.clientX,
      clientY: e.clientY
    }
  }

  onMouseMove (e) {
    if (!this.dragging) return
    this.applyTransforms(this.startTransform, translate(
      e.clientX - this.startPos.clientX,
      e.clientY - this.startPos.clientY
    ))
  }

  onMouseUp (e) {
    console.log('drag end')
    this.dragging = false
    this.startTransform = this.state.transform
  }

  onDoubleClick (e) {
    this.applyTransforms(this.state.transform,
      scale(1.5, e.clientX, e.clientY))
  }

  onWheel (e) {
    this.applyTransforms(this.state.transform,
      scale(1 - e.deltaY / 100, e.clientX, e.clientY))
  }

  // ----- render -----

  render () {
    const {children, onTransform} = this.props

    return children({
      styles: {
        transformOrigin: '0 0 0',
        transform: toCss(this.state.transform),
        // transition: 'transform 0.2s'
      },
      handlers: this.isTouchEnabled ? {
        onTouchStart: this.onTouchStart,
        onTouchMove: this.onTouchMove,
        onTouchEnd: this.onTouchEnd
      } : {
        onMouseDown: this.onMouseDown,
        onMouseMove: this.onMouseMove,
        onMouseUp: this.onMouseUp,
        onDoubleClick: this.onDoubleClick,
        onWheel: this.onWheel
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
