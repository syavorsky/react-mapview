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

function getGhostElement () {
  const ghost = new Image()
  ghost.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  return ghost
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

    this.onDragStart = this.onDragStart.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onWheel = this.onWheel.bind(this)

    this.state = {transform: getTransformProp(this.props)}
  }

  componentWillReceiveProps (nextProps) {
    this.setState({transform: getTransformProp(this.props)})
  }

  componentDidMount () {
    this.isTouchEnabled = isCapable()
    if (!this.isTouchEnabled) this.ghost = getGhostElement()
  }

  applyTransforms (...transforms) {
    const transform = combineTranforms(...transforms)

    if (this.props.onTransform) return onTransform(transform)
    this.setState({transform})
  }

  onTouchStart (e) {
    console.log('touch start')
    this.startTransform = this.state.transform
    this.startTouches = e.touches
    this.center = e.touches.length > 1 ? getCenter(...e.touches) : [0, 0]
  }

  onTouchMove (e) {
    console.log('touch move')
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
    this.startTransform = this.state.transform
    this.startTouches = e.touches
    this.center = [0, 0]
  }

  onDragStart (e) {
    console.log('drag start')
    e.dataTransfer.setDragImage(this.ghost, 10, 10)
    this.startTransform = this.state.transform

    const {clientX, clientY} = e
    this.startPos = {clientX, clientY}
  }

  onDrag (e) {
    console.log('dragging',
      e.clientX, this.startPos.clientX)

    this.applyTransforms(this.startTransform, translate(
      e.clientX - this.startPos.clientX,
      e.clientY - this.startPos.clientY
    ))
  }

  onDragEnd (e) {
    console.log('drag end')
    this.startTransform = this.state.transform
  }

  onWheel (e) {
    const factor = 1 + Math.abs(e.deltaY / 100)
    this.applyTransforms(scale(factor, e.clientX, e.clientY))
  }

  render () {
    const {children, onTransform} = this.props
    console.log('this.isTouchEnabled', this.isTouchEnabled)

    return children({
      styles: {
        transformOrigin: '0 0 0',
        transform: toCss(this.state.transform)
      },
      handlers: this.isTouchEnabled ? {
        onTouchStart: this.onTouchStart,
        onTouchMove: this.onTouchMove,
        onTouchEnd: this.onTouchEnd
      } : {
        // onMouseDown: this.onTouchStart,
        // onMouseMove: this.onTouchMove,
        // onMouseUp: this.onTouchEnd,
        draggable: true,
        onDragStart: this.onDragStart,
        onDrag: this.onDrag,
        onDragEnd: this.onDragEnd,
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
