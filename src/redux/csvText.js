import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  text: "",
  tableData: null
};

export const csvTextSlice = createSlice({
  name: "csvText",
  initialState,
  reducers: {
    updateText: (state, action) => {
      state.text = action.payload;
    },
    updateTableData: (state, action) => {
      state.tableData = action.payload;
    }
  }
});

export const { updateText, updateTableData } = csvTextSlice.actions;
export default csvTextSlice.reducer;
