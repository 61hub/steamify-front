import { countPriceHour, getTotalPrice } from "../../helpers";
import { gamesActionsTypes } from "../actions/games";
import { packsActionsTypes } from "../actions/packs";

export const gamesReducer = (state, action) => {
  switch (action.type) {
    case gamesActionsTypes.fetchGamesSuccess:
      action.games.forEach(game => {
        if (isNaN(parseInt(game.price))) {
          game.price = 0
        } else {
          game.price = parseInt(game.price)
        }
        game.pricePerHour = countPriceHour(game);
        game.totalPrice = getTotalPrice(game);
      });

      return {
        ...state,
        games: action.games
      };

    case packsActionsTypes.fetchPacksSuccess:
      const {packs} = action

      packs.forEach(pack => {
        pack.games = [];
        pack.type = 'pack';
        pack.items.forEach(id => {
          const foundGame = state.games.find(el => el.appId === parseInt(id));
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
      });

      return {
        ...state,
        packs
      };

    case 'gamesToStore':
      return {
        ...state,
        games: [...state.games, ...action.data]
      };

    case 'gameUpdate':
      const game = state.games.map(item => {
        if (item.appId === action.game.appId) {
          return {...item, ...action.game}
        }
        return item;
      });

      return {
        ...state,
        games: game
      };

    case 'packsToStore':
      return {
        ...state,
        games: [...state.games, ...action.packs]
      };
  }
  return {
    games: [],
    packs: []
  }
};
