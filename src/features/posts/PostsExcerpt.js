import PostAuthor from "./PostAuthor";
import TimeStamp from "./TimeStamp";
import ReactionButtonTray from "./ReactionButtonTray";
import { Link } from "react-router-dom";

const PostsExcerpt = ({ post }) => {
  return (
    <article>
      <h3>{post.title}</h3>
      <p className="postCredit">
        <PostAuthor userId={post.userId} />
        <TimeStamp timestamp={post.date} />
      </p>
      <p className="excerpt">{post.body.substring(0,75)}...</p>
      <Link className="postCredit" to={`post/${post.id}`}>Read More</Link>
      <ReactionButtonTray post={post} />
    </article>
  )
}

export default PostsExcerpt