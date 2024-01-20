import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "payload",
  initialState,
  reducers: {
    setPayload: (state, action: PayloadAction<any>) => {
      state.payload = action.payload;
    }
  }
})

export const {
  setPayload,
} = dataSlice.actions;
const payload = dataSlice.reducer;

export default payload;