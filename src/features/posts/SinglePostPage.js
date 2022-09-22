import { useGetPostsQuery } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeStamp from "./TimeStamp";
import ReactionButtonTray from "./ReactionButtonTray";
import { Link, useParams } from "react-router-dom";

const SinglePostPage = () => {
  
  const { postId } = useParams(); 
  const { post, isLoading } =useGetPostsQuery('getPosts', {
    selectFromResult: ({data, isLoading})=>({
      post: data?.entities[postId],
      isLoading,
    }),
  });

  if(isLoading){
    return <p>Loading...</p>
  }

  if(!post){
    return (
      <section>
        <h2>Post not Found!</h2>
      </section>
    );
  }

  return (
    <article>
      <h2>{post.title}</h2>
      <p className="postCredit">
        <PostAuthor userId={post.userId}/>
        <TimeStamp timestamp={post.date}/>
        <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
      </p>
      <p>{post.body}</p>
      <ReactionButtonTray post={post}/>
    </article>
  )
}

export default SinglePostPage;