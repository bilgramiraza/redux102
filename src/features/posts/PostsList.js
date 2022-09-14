import { useSelector } from "react-redux";
import PostAuthor from "./PostAuthor";
import { selectAllPosts } from "./postsSlice";
import ReactionButtonTray from "./ReactionButtonTray";
import TimeStamp from "./TimeStamp";

const PostsList = () => {
  const posts = useSelector(selectAllPosts);

  const orderedPosts = posts.slice().sort((a, b)=>b.date.localeCompare(a.date));

  const renderedPosts = orderedPosts.map(post => (
    <article key={post.id}>
      <h3>{post.title}</h3>
      <p className="postCredit">
        <PostAuthor userId={post.userId} />
        <TimeStamp timestamp={post.date} />
      </p>
      <p>{post.content.substring(0,100)}</p>
      <ReactionButtonTray post={post} />
    </article>
  ));

  return (
    <section>
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  );
}

export default PostsList;