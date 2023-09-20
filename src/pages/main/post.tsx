import { Post as IPost } from "./main";
import { addDoc, collection, query, where, getDocs, deleteDoc} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
interface Props {
  post: IPost;
}
interface Like {
  userId: string;
}

export const Post = (props: Props) => {
  const { post } = props;

  const [user] = useAuthState(auth);

  const [likes, setLike] = useState<Like[] | null>(null);

  const likeRef = collection(db, "likes");

  const likesDoc = query(likeRef, where("postId", "==", post.id));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLike(data.docs.map((doc) => ({ userId: doc.data().userId })));
  };

  useEffect(() => {
    getLikes();
  }, []);

  const addLike = async () => {
    try {
      await addDoc(likeRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLike((prev) =>
          prev ? [...prev, { userId: user?.uid }] : [{ userId: user?.uid }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeLike = async () => {
    try {
      const likeToDelete = doc(db, "likes", )
      await addDoc(likeRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLike((prev) =>
          prev ? [...prev, { userId: user?.uid }] : [{ userId: user?.uid }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };


  const hasUserLike = likes?.find((like) => like.userId === user?.uid);

  return (
    <div className="mainbox">
      <div className="title">
        <h1>{post.title}</h1>
      </div>
      <div className="body">
        <p>{post.description}</p>
      </div>
      <div className="footer">
        <p> @{post.username}</p>
        <button onClick={addLike}>
          {" "}
          {hasUserLike ? <>&#128078;</> : <>&#128077;</>}{" "}
        </button>
        {likes && <p>Likes: {likes?.length}</p>}
      </div>
    </div>
  );
};
