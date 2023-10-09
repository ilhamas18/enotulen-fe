import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./reducer";

const dataSlice = createSlice({
  name: "opd",
  initialState,
  reducers: {
    setOPD: (state, action: PayloadAction<any>) => {
      state.opd = action.payload;
    }
  }
})

export const {
  setOPD
} = dataSlice.actions;
const opd = dataSlice.reducer;
export default opd;