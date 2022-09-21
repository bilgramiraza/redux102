import { Link, useParams } from "react-router-dom";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";
import { useGetUsersQuery } from "./usersSlice";

const UserPage = () => {
  const { userId } = useParams();

  const {
    userData: user,
    isLoading: isLoadingUser,
    isSuccess: isSuccessUser,
    isError: isErrorUser,
    error: errorUser,
  } = useGetUsersQuery('getUsers',{
    selectFromResult: ({data, isLoading, isSuccess, isError, error}) => ({
      userData: data?.entities[userId],
      isLoading,
      isSuccess,
      isError,
      error,
    })
  });

  const {
    data: userPosts,
    isLoading: isLoadingPosts,
    isSuccess: isSuccessPosts,
    isError: isErrorPosts,
    error: errorPosts,
  } = useGetPostsByUserIdQuery(userId);

  let content;
  if(isLoadingPosts || isLoadingUser){
    content = <p>Loading...</p>;
  }
  else if(isSuccessPosts && isSuccessUser){
    const { ids, entities } = userPosts;
    content = (
      <section>
        <h2>{user?.name}</h2>
        <ol>
          {ids.map(id => (
            <li key={id}>
              <Link to={`/post/${id}`}>{entities[id].title}</Link>
            </li>
          ))}
        </ol>
      </section>
    );
  }
  else if(isErrorPosts || isErrorUser){
    content = <p>{errorPosts || errorUser}</p>;
  }

  return content;
}

export default UserPage