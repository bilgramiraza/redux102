import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetUsersQuery } from "../users/usersSlice"
import { useGetPostsQuery, useUpdatePostMutation, useDeletePostMutation } from "./postsSlice"

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const { post, isLoading: isLoadingPost, isSuccess: isSuccessPost} = useGetPostsQuery('getPosts',{
    selectFromResult: ({data, isLoading, isSuccess}) => ({
      post: data?.entities[postId],
      isLoading,
      isSuccess,
    }),
  });

  const {data: users, isSuccess: isSuccessUsers } = useGetUsersQuery('getUsers');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(()=>{
    if(isSuccessPost){
      setTitle(post.title);
      setContent(post.body);
      setUserId(post.userId);
    }
  },[isSuccessPost, post?.title, post?.body, post?.userId]);

  if(isLoadingPost){
    return <p>Loading...</p>
  }

  if(!post){
    return (
      <section>
        <h2>Post Not Found!</h2>
      </section>
    );
  }

  const onTitleChanged = e => setTitle(e.target.value);
  const onContentChanged = e => setContent(e.target.value);
  const onAuthorChanged = e => setUserId(Number(e.target.value));

  const canSave = [title, content, userId].every(Boolean) && !isLoading;

  const onSavePostClicked = async () => {
    if(canSave){
      try {
        await updatePost({
          id:post?.id, 
          title, 
          body:content, 
          userId,
        }).unwrap();
        setTitle('');
        setContent('');
        setUserId('');
        navigate(`/post/${postId}`);
      } catch (error) {
        console.error('Failed to Save the Post', error);
      }
    }
  };

  const userOptionsList = users.ids.map(id =>(
    <option 
      key={id}
      value={id}> 
        {users.entities[id].name}
    </option>
  ));

  const onDeletePostClicked = async () => {
    try {
      await deletePost({
        id:post?.id
      }).unwrap();

      setTitle('');
      setContent('');
      setUserId('');
      navigate('/');
    } catch (error) {
      console.error('Failed to Delete the Post', error);
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title: </label>
        <input 
          type="text" 
          id="postTitle" 
          name="postTitle"
          value={title}
          onChange={onTitleChanged} 
        />
        <label htmlFor="postAuthor">Author: </label>
        <select 
          id="postAuthor"
          defaultValue={userId}
          onChange={onAuthorChanged}
        >
          {userOptionsList}
        </select>
        <label htmlFor="postContent">Content: </label>
        <textarea 
          id="postContent" 
          name="postContent"
          value={content}
          onChange={onContentChanged} 
          rows={10}
        />
        <div className="editButtonTray">
          <button 
            type="button"
            className="save"
            onClick={onSavePostClicked}
            disabled={!canSave}
          >
            Save Post
          </button>
          <button 
            type="button"
            className="delete"
            onClick={onDeletePostClicked}
          >
            Delete Post
          </button>
        </div>
      </form>
    </section>
  )
}

export default EditPostForm;