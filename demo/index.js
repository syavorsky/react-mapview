import React from 'react'
import {render} from 'react-dom'
import {noScroll} from '../util/etc'
import mapview, {propTypes as mapPropTypes} from '..'

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

const App = props => {
  const {styles, target} = props
  return <div style={{...css.figure, ...styles}} ref={target} />
}

App.propTypes = mapPropTypes

const MapApp = mapview(App)

noScroll(document.body)
render((
  <div style={{width: 500, height: 500, border: '1px solid red'}}>
    <MapApp transform={{rotate: 15}} />
  </div>
), document.getElementById('app'))
