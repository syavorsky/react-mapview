import React, {Component} from 'react'
import {render} from 'react-dom'
import {disable as disableTouch} from './util/touch'
import Mapview from '.'

const css = {
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh'
  },
  figure: {
    position: 'absolute',
    width: 200,
    height: 200,
    background: 'green'
  },
  center: {
    position: 'absolute',
    display: 'block',
    margin: '-2px 0 0 -2px',
    width: 5,
    height: 5,
    background: 'red',
    borderRadius: '50%'
  }
}

class App extends Component {
  render () {
    return (
      <Mapview minScale={0.2} maxScale={5} scaleFactor={0.8}>
        {({styles, handlers, center}) => (
          <div style={css.root} {...handlers}>
            <div style={{...css.figure, ...styles}} />
            <span style={{...css.center, left: center[0], top: center[1]}} />
          </div>
        )}
      </Mapview>
    )
  }
}

disableTouch(document.body)
render(<App />, document.getElementById('app'))
