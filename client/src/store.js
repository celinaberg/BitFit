// @flow

import { applyMiddleware, createStore } from "redux";
import promiseMiddleware from "redux-promise-middleware";
import ReduxThunk from "redux-thunk";
import logger from "redux-logger";
import reducers from "./reducers";

const middleware = applyMiddleware(promiseMiddleware(), ReduxThunk, logger);
export default createStore(reducers, middleware);
