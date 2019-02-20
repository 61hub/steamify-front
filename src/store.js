import {createStore} from "redux"



function gamesReducer(state, action) {
  switch (action.type) {
    case 'gamesToStore':
      return {
        games: [...state.games, ...action.data]
      }
    case 'packsToStore':
      return {
        games: [...state.games, ...action.packs]
      }
    case 'newItem':
      const packId = action.packId
      const item = action.item
      const foundPack = {...state.games.find((game) => game.packId == packId)}
      foundPack.items = [...foundPack.items, item]

  }
 return {
   games: []
 }
}
const store = createStore(
  gamesReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store