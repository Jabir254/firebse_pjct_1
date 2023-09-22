import { Post as IPost } from "./main";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";

interface Props {
  post: IPost;
}
interface Like {
  likeId: string;
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
    setLike(data.docs.map((doc) => ({ userId: doc.data().userId , likeId: doc.id})));
  };

  useEffect(() => {
    getLikes();
  }, []);

  const addLike = async () => {
    try {
      const newDoc = await addDoc(likeRef, {
        userId: user?.uid,
        postId: post.id,
      });
      if (user) {
        setLike((prev) =>
          prev
            ? [...prev, { userId: user.uid, likeId: newDoc.id }]
            : [{ userId: user.uid, likeId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  

  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(
        likeRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );

      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;

      const likeToDelete = doc(db, "likes", likeToDeleteData.docs[0].id);
      await deleteDoc(likeToDelete);
      if (user) {
        setLike((prev) => prev && prev.filter((like) => like.likeId !== likeId));
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
        <button onClick={hasUserLike ? removeLike: addLike}>
          {hasUserLike ? <>&#128078;</> : <>&#128077;</>}{" "}
        </button>
        {likes && <p>Likes: {likes?.length}</p>}
      </div>
    </div>
  );
};
