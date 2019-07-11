import { createSelector } from 'reselect'
import { countPriceHour, getTotalPrice } from "../../helpers";

const getPacks = state => state.packs
const getGames = state => state.games

export const getComposedPacks = createSelector(
  [getPacks, getGames],
  (packs, games) => {
    return packs.map(packData => {
      const pack = {...packData}

      pack.games = [];
      pack.type = 'pack';
      pack.items.forEach(id => {
        const foundGame = games.find(el => el.appId === parseInt(id));
        if (foundGame) {
          pack.games.push(foundGame);
        }
      });

      pack.playtimeForever = 0;
      if (pack.games && pack.games.length) {
        pack.games.forEach(g => pack.playtimeForever += g.playtimeForever);
        pack.logo = pack.games[Math.floor(Math.random() * (pack.games.length - 1))].logo;
        pack.pricePerHour = countPriceHour(pack);
      }
      pack.totalPrice = pack.price
      return pack
    });
  }
);

export const getComposedGames = createSelector(
  [getGames],
  (games) => {
    return games.map(gameData => {
      const game = {...gameData}
      if (isNaN(parseInt(game.price))) {
        game.price = 0
      } else {
        game.price = parseInt(game.price)
      }
      game.pricePerHour = countPriceHour(game);
      game.totalPrice = getTotalPrice(game);
      return game
    });
  }
)
