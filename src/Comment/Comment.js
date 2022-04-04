import React, { useEffect, useState } from "react";
import "./Comment.css";
import cover1 from "../Home/img/cover 1.png";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useUserContext } from "../Context/UserContext";

function Comment({ comment, userImg, username, id, postId }) {
  const { currentUser } = useUserContext();
  const [hasLiked, setHasLiked] = useState(false);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    onSnapshot(
      collection(db, "posts", postId, "comments", id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, id]);

  console.log(postId);
  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes]);

  const likeComment = async () => {
    console.log(currentUser?.uid);
    if (hasLiked) {
      await deleteDoc(
        doc(db, "posts", postId, "comments", id, "likes", currentUser?.uid)
      );
    } else {
      await setDoc(
        doc(db, "posts", postId, "comments", id, "likes", currentUser?.uid),
        {
          username: currentUser?.displayName,
        }
      );
    }
  };

  return (
    <div className="comment__container">
      <img onClick={likeComment} className="comment__image" src={userImg} alt="" />
      <div>
        <div>
          <span className="comment__username">{username}</span>
          <span>{comment}</span>
        </div>
        <div className="comment__details">
          {likes.length > 0 ? (
            likes.length > 1 ? (
              <p onClick={likeComment}>{likes.length} Likes</p>
            ) : (
              <p onClick={likeComment}>{likes.length} Like</p>
            )
          ) : (
            <p onClick={likeComment}>0 likes</p>
          )}
          {/*<span>{} Reply</span>*/}
        </div>
      </div>
    </div>
  );
}

export default Comment;
