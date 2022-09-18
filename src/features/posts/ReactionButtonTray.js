import { useDispatch } from "react-redux";
import { reactionAdded } from "./postsSlice";

const reactionEmoji = {
  thumbsUp:'👍',
  thumbsDown:'👎',
  heart:'❤️',
  fire:'🔥',
  coffee:'☕',
};

const ReactionButtonTray = ({ post }) => {
  const dispatch = useDispatch();

  const reactionButtons = Object.entries(reactionEmoji).map(([name,emoji])=>{
    return (
      <button 
        key={name} 
        type="button"
        className="reactionButton"
        onClick={()=>
          dispatch(reactionAdded({postId:post.id, reaction:name}))
        }
      >
        {emoji} {post.reactions[name]}
      </button>
    );
  });
  return (
    <div className="reactionTray">{reactionButtons}</div>
  )
}

export default ReactionButtonTray