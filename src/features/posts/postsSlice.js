import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {id:'1', title:'Learning Redux Toolkit', content:"This is the start of me learning Redux using the Redux Toolkit."},
  {id:'2', title:'Slices', content:"If I had a pizza slice for everytime I read the word Slice... ."},
];

const postsSlice = createSlice({
  name:'posts',
  initialState,
  reducers:{
    postAdded(state, action){
      state.push(action.payload)
    },
  },
});

export const selectAllPosts = (state) => state.posts;

export const { postAdded } = postsSlice.actions;

export default postsSlice.reducer;