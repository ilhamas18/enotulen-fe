import { combineReducers } from "redux";
import opd from "./opd/action";
import profile from "./profile/action";
import payload from "./payload/action";

const combinedReducer = combineReducers({
  opd,
  profile,
  payload
})

export default combinedReducer;

export type State = ReturnType<typeof combinedReducer>;