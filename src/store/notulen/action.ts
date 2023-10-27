import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "notulen",
  initialState,
  reducers: {
    setNotulen: (state, action: PayloadAction<any>) => {
      state.notulen = action.payload;
    }
  }
})

export const {
  setNotulen,
} = dataSlice.actions;
const notulen = dataSlice.reducer;

export default notulen;