import PostAuthor from "./PostAuthor";
import TimeStamp from "./TimeStamp";
import ReactionButtonTray from "./ReactionButtonTray";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";

const PostsExcerpt = ({ postId }) => {
  const post = useSelector(state => selectPostById(state,postId));
  
  return (
    <article>
      <h2>{post.title}</h2>
      <p className="postCredit">
        <PostAuthor userId={post.userId} />
        <TimeStamp timestamp={post.date} />
      </p>
      <p className="excerpt">{post.body.substring(0,75)}...</p>
      <p className="postCredit">
        <Link to={`post/${post.id}`}>Read More</Link>
      </p>
      <ReactionButtonTray post={post} />
    </article>
  )
}

export default PostsExcerpt