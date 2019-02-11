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