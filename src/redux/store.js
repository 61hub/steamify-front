import {createStore, compose, applyMiddleware} from "redux"
import thunk from "redux-thunk";
import reducers from "./reducers";

const middlewares = window.__REDUX_DEVTOOLS_EXTENSION__ ? compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__()
) : applyMiddleware(thunk);

const store = createStore(
  reducers,
  middlewares
);

export default store
