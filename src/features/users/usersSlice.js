import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {id:'0',name:"Fella John"},
  {id:'1',name:"Dude Smith"},
  {id:'2',name:"Guy Harris"},
];

const usersSlice = createSlice({
  name:'users',
  initialState,
  reducers:{},
});

export const selectAllUsers = (state) => state.users;

export default usersSlice.reducer;