import React from 'react'
import {formatPlaytime, getTotalPrice} from "../helpers";
import Game from "./Game";

export const Stats = ({ games, packs }) => {
  let price = 0;
  let playtimeForever = 0;

  games.forEach(game => {
    if (!game.hidden) {
      price = price + getTotalPrice(game);
      playtimeForever = playtimeForever + game.playtimeForever;
    }
  });

  packs.forEach(pack => {
    price = price + pack.price;
    playtimeForever = playtimeForever + pack.playtimeForever;
  });

  return (
    <>
      <div className="stats">
        <div>{`Total price: ${price}P`}</div>
        <div>{`Total playtime: ${Math.round(playtimeForever / 60)}hrs`}</div>
      </div>
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
