import { 
  createSelector, 
  createEntityAdapter
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import { apiSlice } from "../api/apiSlice";

const postsAdapter = createEntityAdapter({
  sortComparer:(a, b) => b.date.localeCompare(a.date)
});

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPosts: builder.query({
      query: () => '/posts',
      transformResponse: responseData => {
        let min = 1;
        const loadedPosts = responseData.map(post => {
          if(!post?.date) post.date = sub(new Date(), {minutes: min++}).toISOString();
          if(!post?.reactions) post.reactions = {
            thumbsUp:0,
            thumbsDown:0,
            heart:0,
            fire:0,
            coffee:0,
          };
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => [
        {type: 'Post', id: "LIST" },
        ...result.ids.map(id => ({type: 'Post', id}))
      ],
    }),
  })
});

export const {
  useGetPostQuery
} = extendedApiSlice;

//Returns Query Result Object
export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

//Memoized Selector
const selectPostsData = createSelector(
  selectPostsResult,                //Input Function
  postsResult => postsResult.data,  //Output Function
);

//get Selectors Creates Selection functions that we rename using object destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors(state => selectPostsData(state) ?? initialState);