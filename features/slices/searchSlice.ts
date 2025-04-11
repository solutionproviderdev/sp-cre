// features/slices/searchSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchText: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
  },
});

export const { setSearchText } = searchSlice.actions;
export default searchSlice.reducer;
