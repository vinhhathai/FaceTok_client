import { createSlice } from '@reduxjs/toolkit';

// Khởi tạo state ban đầu
const initialState = {
  email: "",
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload; // Lưu email vào state
    }
  },
});

export const { setEmail } = emailSlice.actions; // Export action setEmail

export default emailSlice.reducer;
