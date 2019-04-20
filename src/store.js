import {createStore, compose, applyMiddleware} from "redux"
import thunk from "redux-thunk";
import axios from "axios";
import {countPriceHour, getTotalPrice} from "./helpers";

const actionTypes = {
  packsFetched: 'packsFetched',
  gamesFetched: 'gamesFetched',
  fetchGames: 'fetchGamesRequest'
};

export const fetchGamesAction = () => ({
  type: actionTypes.fetchGames
});

export const packsFetched = (packs) => ({
  type: actionTypes.packsFetched,
  packs
});

export const gamesFetched = (games) => ({
  type: actionTypes.gamesFetched,
  games
});


export const fetchPacks = () => (
  (dispatch) => (
    axios
      .get(`http://steamify-api.61hub.com/v1/packs`)
      .then(response => dispatch(packsFetched(response.data)))
  )
);

export const fetchGames = () => (
  (dispatch) => (
    axios
      .get(`http://steamify-api.61hub.com/v1/games`)
      .then(response => dispatch(gamesFetched(response.data)))
  )
);

const gamesReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.gamesFetched:
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

    case actionTypes.packsFetched:
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

    case 'dataFetched':
      return {
        ...state,
        games: action.data
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

const store = createStore(
  gamesReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store
