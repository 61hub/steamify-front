import React from "react"
import styles from './GameLogo.module.scss'

export const GameLogo = ({ src }) => (
  <div style={{backgroundImage: `url(${src})`}} className={styles.logoWrapper} />
)
