import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";

import PostAuthor from "./PostAuthor";
import TimeStamp from "./TimeStamp";
import ReactionButtonTray from "./ReactionButtonTray";


const SinglePostPage = () => {
  //TODO: Get PostID

  const post = useSelector((state)=> selectPostById(state, postId));
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
      </p>
      <p>{post.body}</p>
      <p className="postCredit">
        <TimeStamp timestamp={post.date}/>
      </p>
      <ReactionButtonTray post={post}/>
    </article>
  )
}

export default SinglePostPage;