import { combineReducers } from "redux";
import opd from "./opd/action";
import profile from "./profile/action";

const combinedReducer = combineReducers({
  opd,
  profile
})

export default combinedReducer;

export type State = ReturnType<typeof combinedReducer>;