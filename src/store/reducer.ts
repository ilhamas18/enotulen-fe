import { combineReducers } from "redux";
import profile from "./profile/action";

const combinedReducer = combineReducers({
  profile
})

export default combinedReducer;

export type State = ReturnType<typeof combinedReducer>;