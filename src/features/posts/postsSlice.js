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
    getPostsByUserId: builder.query({
      query: id => `/posts/?userId=${id}`,
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
      providesTags: (result, error, arg) => {
        console.log(result);
        return [...result.ids.map(id => ({type: 'Post', id}))];
      }
    }),
    addNewPost: builder.mutation({
      query: initialPost => ({
        url: '/posts',
        method: 'POST',
        body: {
          ...initialPost,
          userId:Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions: {
            thumbsUp:0,
            thumbsDown:0,
            heart:0,
            fire:0,
            coffee:0,
          },
        }
      }),
      invalidatesTags: [{type: 'Post', id:"LIST"}],
    }),
    updatePost: builder.mutation({
      query: initialPost => ({
        url: `/posts/${initialPost.id}`,
        method: 'PUT',
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        }
      }),
      invalidatesTags: (result, error, arg) =>[
        {type: 'Post', id: arg.id}
      ]
    }),
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        {type: 'Post', id: arg.id}
      ]
    }),
  })
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
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