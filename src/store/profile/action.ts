import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
    }
  }
})

export const {
  setProfile
} = dataSlice.actions;
const profile = dataSlice.reducer;
export default profile;