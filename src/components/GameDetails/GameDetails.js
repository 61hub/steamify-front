import React from 'react'
import styles from "./GameDetails.module.scss";
import { formatPlaytime, definePriceHourClassName } from "../../helpers";
import classNames from 'classnames'
import { Emoji } from "../Emoji/Emoji";
import * as _ from 'lodash'

export const GameDetails = ({ data: { status, totalPrice, name, ...data } = {}, index, onTitleClick }) => (
  <>
    <div className={styles.gameInformation}>
      <div className={styles.gameName} onClick={onTitleClick}>
        {name}
      </div>

      <div className={styles.gameMinorInfo}>
        <div className={classNames(styles.gameHourPrice, styles[definePriceHourClassName(data)])} />
        <div className={styles.gameIndex}>
          {index + 1}.
        </div>
        <div>
          {totalPrice}P
        </div>

        {!_.isNil(data.pricePerHour) &&
          <div className={styles.pricePerHour}>
            {data.pricePerHour.toFixed(0)}P/hr
          </div>
        }

      </div>
    </div>

    <div className={styles.gameDuration}>
      <div className={styles.status}>
        {status === 'completed' && <Emoji type="✅" />}
        {status === 'endless' && <Emoji type="∞" className={styles.endless} />}
        {status === 'playing' && <Emoji type="🕹" />}
        {status === 'abandoned' && <Emoji type="☠️" />}
        {status === 'story' && <Emoji type="📖" />}
      </div>
      {formatPlaytime(data.playtimeForever)}
    </div>
  </>
)
