import {createStore} from "redux"



function gamesReducer(state, action) {
  switch (action.type) {
    case 'gamesToStore':
      return {
        games: [...action.data]
      }
  }
 return {
   games: []
 }
}
const store = createStore(gamesReducer);

export default store