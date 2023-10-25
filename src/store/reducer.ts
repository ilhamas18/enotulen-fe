import { combineReducers } from "redux";
import opd from "./opd/action";
import profile from "./profile/action";
import notulen from "./notulen/action";

const combinedReducer = combineReducers({
  opd,
  profile,
  notulen
})

export default combinedReducer;

export type State = ReturnType<typeof combinedReducer>;