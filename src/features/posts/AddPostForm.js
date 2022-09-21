import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "../users/usersSlice";
import { useAddNewPostMutation } from "./postsSlice";


const AddPostForm = () => {
  const [addNewPost, { isLoading }] = useAddNewPostMutation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState('');

  const { data: users, isSuccess } = useGetUsersQuery('getUsers');

  const onTitleChanged = e => setTitle(e.target.value);
  const onContentChanged = e => setContent(e.target.value);
  const onAuthorChanged = e => setUserId(e.target.value);

  const canSave = [title, content, userId].every(Boolean) && !isLoading;
  
  const onSavePostClicked = async () =>{
    if(canSave){
      try{
        await addNewPost({title, body:content, userId}).unwrap();
        
        setTitle('');
        setContent("");
        setUserId('');
        navigate('/');
      }
      catch (err){
        console.error('failed to save the post', err);
      }
    }
  };

  let usersOptionList;
  if(isSuccess){
    usersOptionList = users.ids.map(id => (
      <option key={id} value={id}>
        {users.entities[id].name}
      </option>
    ));
  }
  return (
    <section>
      <h2>Add a New Post</h2>
      <form>  
        <label htmlFor="postAuthor">Author:</label>
        <select 
          id="postAuthor" 
          name="postAuthor" 
          value={userId} 
          onChange={onAuthorChanged}
        >
          <option value=""></option>
          {usersOptionList}
        </select>
        <label htmlFor="postTitle">Title:</label>
        <input 
          type="text" 
          id="postTitle" 
          name="postTitle" 
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea 
          id="postContent" 
          name="postContent" 
          value={content}
          onChange={onContentChanged}
        />
        <button 
          type="button"
          onClick={onSavePostClicked}
          disabled={!canSave}
        >Save Post</button>
      </form>
    </section>
  )
}

export default AddPostForm