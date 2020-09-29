import { gamesActionsTypes } from "../actions/games";

export const gamesReducer = (state = [], action) => {
  switch (action.type) {
    case gamesActionsTypes.fetchGamesSuccess:
      return action.games.map(game => ({
        playtimeForever: game.playtime_forever,
        name: game.name,
        dlc: [],
        appId: game.appid,
        store: game.store,
        isHidden: game.isHidden || false,
        price: game.price || 0,
        logo: game.img_logo_url
      }));

    case gamesActionsTypes.gameUpdate:
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
