import { createSlice, nanoid, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const postsURL = 'https://jsonplaceholder.typicode.com/posts';

const initialState = {
  posts :[],
  status:'idle', // idle / loading / success / failure
  error : null,
  count:0,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ()=>{
    const response = await axios.get(postsURL);
    return [...response.data];
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost)=>{
  const response = await axios.post(postsURL, initialPost);
  return response.data;
});

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost)=>{
  const { id } = initialPost;
  const response = await axios.put(`${postsURL}/${id}`, initialPost);
  return response.data;
});

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost)=>{
  const { id } = initialPost;
  const response = await axios.delete(`${postsURL}/${id}`);
  if(response?.status === 200) return initialPost;       //Place holder Code to deal with 
  return `${response?.status}: ${response?.statusText}`; //the Empty return of Json Placeholder
});

const postsSlice = createSlice({
  name:'posts',
  initialState,
  reducers:{
    reactionAdded(state,action){
      const { postId, reaction } = action.payload;
      const targetPost = state.posts.find(post => post.id === postId);
      if(targetPost){
        targetPost.reactions[reaction]++;
      } 
    },
    increaseCount(state, action){
      state.count = state.count+1;
    }
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
      .addCase(updatePost.fulfilled, (state, action)=>{
        if(!action.payload?.id){
          console.log('Update could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        const posts = state.posts.filter(post => post.id !== id);
        state.posts = [...posts, action.payload];
      })
      .addCase(deletePost.fulfilled, (state, action)=>{
        if(!action.payload?.id){
          console.log('Deletion could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        const posts = state.posts.filter(post => post.id !== id);
        state.posts = posts;
      })
  }
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

export const selectPostById = (state,postId) => state.posts.posts.find(post => post.id === postId);

export const { increaseCount, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;