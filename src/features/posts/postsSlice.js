import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {id:'1', title:'Learning Redux Toolkit', content:"This is the start of me learning Redux using the Redux Toolkit."},
  {id:'2', title:'Slices', content:"If I had a pizza slice for everytime I read the word Slice... ."},
];

const postsSlice = createSlice({
  name:'posts',
  initialState,
  reducers:{},
});

export const selectAllPosts = (state) => state.posts;

export default postsSlice.reducer;