import { createSlice, nanoid} from "@reduxjs/toolkit";
import { sub } from "date-fns";

const initialState = [
  {
    id:'1', 
    title:'Learning Redux Toolkit', 
    content:"This is the start of me learning Redux using the Redux Toolkit.", 
    date:sub(new Date(),{minutes:10}).toISOString(),
    reactions:{
      thumbsUp:0,
      thumbsDown:0,
      heart:0,
      fire:0,
      coffee:0,
    },
  },
  {
    id:'2', 
    title:'Slices', 
    content:"If I had a pizza slice for everytime I read the word Slice... .",
    date:sub(new Date(),{minutes:5}).toISOString(),
    reactions:{
      thumbsUp:0,
      thumbsDown:0,
      heart:0,
      fire:0,
      coffee:0,
    },
  },
];

const postsSlice = createSlice({
  name:'posts',
  initialState,
  reducers:{
    postAdded:{
      reducer(state, action){
        state.push(action.payload)
      },
      prepare(title,content, userId){
        return {
          payload:{
            id:nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            userId,
            reactions:{
              thumbsUp:0,
              thumbsDown:0,
              heart:0,
              fire:0,
              coffee:0,
            },
          }
        };
      },
    },
    reactionAdded(state,action){
      const { postId, reaction } = action.payload;
      const targetPost = state.find(post => post.id === postId);
      if(targetPost){
        targetPost.reactions[reaction]++;
      } 
    },
  },
});

export const selectAllPosts = (state) => state.posts;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;