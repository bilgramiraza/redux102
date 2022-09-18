import { useSelector } from "react-redux";
import { selectPostIds, getPostsStatus ,getPostsError } from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";


const PostsList = () => {
  const orderedPostIds = useSelector(selectPostIds);
  const postsStatus = useSelector(getPostsStatus);
  const postsError = useSelector(getPostsError);

  let content;
  if(postsStatus === 'loading'){
    content = <p>"Loading..."</p>;
  }
  else if(postsStatus === 'success'){
    content = orderedPostIds.map(postId => <PostsExcerpt key={postId} postId={postId} />);
  }
  else if(postsStatus === 'failure'){
    content = <p>{postsError}</p>
  }

  return (
    <section>
      {content}
    </section>
  );
}

export default PostsList;