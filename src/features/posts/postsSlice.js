import { 
  createSlice, 
  createAsyncThunk, 
  createSelector, 
  createEntityAdapter
} from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const postsURL = 'https://jsonplaceholder.typicode.com/posts';

const postsAdapter = createEntityAdapter({
  sortComparer:(a, b) => b.date.localeCompare(a.date)
});

const initialState = postsAdapter.getInitialState({
  status:'idle', // idle / loading / success / failure
  error : null,
  count:0,
});

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
      const targetPost = state.entities[postId];
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

        postsAdapter.upsertMany(state, loadedPosts);
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
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action)=>{
        if(!action.payload?.id){
          console.log('Update could not complete');
          console.log(action.payload);
          return;
        }
        action.payload.date = new Date().toISOString();
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action)=>{
        if(!action.payload?.id){
          console.log('Deletion could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        postsAdapter.removeOne(state, id);
      })
  }
});


//'get Selectors Creates Selection functions that we rename using object destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors(state => state.posts);

export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.userId === userId)
);

export const { increaseCount, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;