import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: { id: "tD4KfLi7mKakIAl3wvcQuBR1Wyw2" },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserInfo: (state, action) => {
      state.userInfo = JSON.stringify(action.payload);
    },
  },
});

export const { addUserInfo } = userSlice.actions;
export default userSlice.reducer;
