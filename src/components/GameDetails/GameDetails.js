import React from 'react'
import styles from "./GameDetails.module.scss";
import { formatPlaytime, definePriceHourClassName } from "../../helpers";
import classNames from 'classnames'

export const GameDetails = ({ data: { status, totalPrice, name, ...data } = {}, index, onTitleClick }) => (
  <>
    <div className={styles.gameInformation}>
      <div className={styles.gameName} onClick={onTitleClick}>
        {name}
      </div>

      <div className={styles.gameMinorInfo}>
        <div className={classNames(styles.gameHourPrice, styles[definePriceHourClassName(data)])} />
        <div className={styles.gameIndex}>
          #{index + 1}
        </div>
        <div>
          {totalPrice}P
        </div>
      </div>
    </div>

    <div className={styles.gameDuration}>
      <div className={styles.status}>
        {status === 'completed' && <span>✅</span> }
        {status === 'endless' && <span className={styles.endless}>∞</span>}
        {status === 'playing' && <span>🕹</span>}
        {status === 'abandoned' && <span>☠️</span>}
        {status === 'story' && <span>📖</span>}
      </div>
      {formatPlaytime(data.playtimeForever)}
    </div>
  </>
)
