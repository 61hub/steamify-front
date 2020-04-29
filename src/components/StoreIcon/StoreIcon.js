import React from 'react'
import * as steam from './img/steam.png'
import * as rockstar from './img/rockstar.png'
import * as gog from './img/gog.png'
import * as origin from './img/origin.png'
import * as epic from './img/epic.png'

const icons = { steam, rockstar, gog, origin, epic }

const StoreIcon = ({ store }) => {
  return (
    <img src={icons[store]} alt={store} />
  )
}

export default StoreIcon
