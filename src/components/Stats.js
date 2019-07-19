import React from 'react'
import {formatPlaytime} from "../helpers";
import Game from "./Game/Game";

export const Stats = ({ games }) => {
  return (
    <>
      <div className="twoWeeks">
        <h3>Two weeks leaders:</h3>
        {
          games
            .filter(g => g.playtimeTwoWeeks)
            .sort((g1, g2) => g2.playtimeTwoWeeks - g1.playtimeTwoWeeks)
            .map(g => {
              const _g = {...g};
              _g.playtimeForever = _g.playtimeTwoWeeks
              return _g
            })
            .map((g, i) => <Game data={g} index={i}>{g.name} {formatPlaytime(g.playtimeTwoWeeks)}</Game>)
        }
      </div>

    </>
  )
};
