import { gamesActionsTypes } from "../actions/games";

export const gamesReducer = (state = [], action) => {
  switch (action.type) {
    case gamesActionsTypes.fetchGamesSuccess:
      return action.games;

    case 'gamesToStore':
      return [...state, ...action.data]

    case 'gameUpdate':
      return state.map(item => {
        if (item.appId === action.game.appId) {
          return {...item, ...action.game}
        }
        return item;
      });

    default:
      return state
  }
};
