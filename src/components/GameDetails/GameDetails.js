import React from 'react'
import styles from "./GameDetails.module.scss";
import { formatPlaytime, definePriceHourClassName } from "../../helpers";
import classNames from 'classnames'

export const GameDetails = ({ data, index, onTitleClick }) => (
  <>
    <div className={styles.gameInformation}>
      <div className={styles.gameName} onClick={onTitleClick}>
        {data.name}
      </div>

      <div className={styles.gameMinorInfo}>
        <div className={classNames(styles.gameHourPrice, styles[definePriceHourClassName(data)])} />
        <div className={styles.gameIndex}>
          #{index + 1}
        </div>
        <div>
          {data.totalPrice}P
        </div>
      </div>
    </div>

    <div className={styles.icons}>
      {data.completed && <span>✅</span> }
      {data.endless && <span className={styles.infiniteIcon}>∞</span>}
      {!data.completed && !data.endless && <span>⚠️</span>}
    </div>

    <div className={styles.gameDuration}>
      {formatPlaytime(data.playtimeForever)}
    </div>
  </>
)
