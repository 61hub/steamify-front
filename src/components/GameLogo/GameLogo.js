import React from "react"
import styles from './GameLogo.module.scss'

export const GameLogo = ({ src }) => (
  <div className={styles.logoWrapper}>
    <img src={src} alt="Game logo" />
  </div>
)
