import { createSlice, nanoid, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const postsURL = 'https://jsonplaceholder.typicode.com/posts';

const initialState = {
  posts :[],
  status:'idle', // idle / loading / success / failure
  error : null,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ()=>{
    const response = await axios.get(postsURL);
    return [...response.data];
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost)=>{
  const response = await axios.post(postsURL, initialPost);
  return response.data;
});

const postsSlice = createSlice({
  name:'posts',
  initialState,
  reducers:{
    postAdded:{
      reducer(state, action){
        state.posts.push(action.payload)
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
      const targetPost = state.posts.find(post => post.id === postId);
      if(targetPost){
        targetPost.reactions[reaction]++;
      } 
    },
  },
  extraReducers(builder){
    builder
      .addCase(fetchPosts.pending,(state,action)=>{
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state,action)=>{
        state.status = 'success';

        let min = 1;
        const loadedPosts = action.payload.map(post =>{
          post.date = sub(new Date(), {minutes:min++}).toISOString();
          post.reactions = {
            thumbsUp:0,
            thumbsDown:0,
            heart:0,
            fire:0,
            coffee:0,
          };
          return post;
        });

        // state.posts = loadedPosts;
        state.posts = state.posts.concat(loadedPosts);
        
      })
      .addCase(fetchPosts.rejected, (state, action)=>{
        state.status = 'failure';
        state.error  = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action)=>{
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp:0,
          thumbsDown:0,
          heart:0,
          fire:0,
          coffee:0,
        };
        console.log(action.payload);
        state.posts.push(action.payload);
      })
  }
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;