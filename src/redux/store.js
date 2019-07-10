import {createStore, compose, applyMiddleware} from "redux"
import thunk from "redux-thunk";
import { gamesReducer } from "./reducers/games";

const middlewares = window.__REDUX_DEVTOOLS_EXTENSION__ ? compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__()
) : applyMiddleware(thunk);

const store = createStore(
  gamesReducer,
  middlewares
);

export default store
