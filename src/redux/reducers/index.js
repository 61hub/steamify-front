import { gamesReducer } from "./games";
import { packsReducer } from "./packs";
import { combineReducers } from "redux";

export default combineReducers({
  games: gamesReducer,
  packs: packsReducer
})
