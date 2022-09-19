import { useAddReactionMutation } from "./postsSlice";

const reactionEmoji = {
  thumbsUp:'👍',
  thumbsDown:'👎',
  heart:'❤️',
  fire:'🔥',
  coffee:'☕',
};

const ReactionButtonTray = ({ post }) => {
  const [addReaction] = useAddReactionMutation();

  const reactionButtons = Object.entries(reactionEmoji).map(([name,emoji])=>{
    return (
      <button 
        key={name} 
        type="button"
        className="reactionButton"
        onClick={()=>{
          const newValue = post.reactions[name]++; 
          addReaction({ 
            postId:post.id , 
            reactions:{
              ...post.reactions,
              [name]:newValue
              }
            });
          }
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