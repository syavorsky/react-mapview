import React, {Component} from 'react'
import {render} from 'react-dom'
import {prevent as preventTouch} from '../util/touch'
import Mapview from '..'

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
      <Mapview initialScale={1} initialRotation={15}>
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

preventTouch(document.body)
render(<App />, document.getElementById('app'))
