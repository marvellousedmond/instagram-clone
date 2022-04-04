import React, { useEffect } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import option from "./img/option.PNG";
import save from "./img/save.PNG";
import ChatIcon from "@material-ui/icons/ChatBubbleOutline";
import SendIcon from "@material-ui/icons/Send";
import FavoriteIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteFilledIcon from "@material-ui/icons/FavoriteOutlined";
import SmileyIcon from "@material-ui/icons/SentimentSatisfiedOutlined";
import "./Post.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { db } from "../Firebase/firebase";
import Picker from "emoji-picker-react";
import { useUserContext } from "../Context/UserContext";

function Post({
  username,
  location,
  displayName,
  postImg,
  caption,
  id,
  profileImg,
  setSinglePost,
  setShowModal,
  setModalOpen,
  currentUserImg,
}) {
  const { currentUser } = useUserContext();
  const [comment, setComment] = useState("");
  const [totalComments, setTotalComments] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setTotalComments(snapshot.docs.length);
        }
      ),
    [db, id]
  );

  useEffect(() => {
    onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
      setLikes(snapshot.docs)
    );
  }, [db, id]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes]);

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", currentUser?.uid));
    } else {
      await setDoc(doc(db, "posts", id, "likes", currentUser?.uid), {
        username: currentUser?.displayName,
      });
    }
  };

  const postDetails = () => {
    setShowModal(true);
    setSinglePost({
      postImage: postImg,
      postName: username,
      postCaption: caption,
      profileImage: profileImg,
      postid: id,
    });
  };

  const sendComment = async (e) => {
    e.preventDefault();
    setShowPicker(false);

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "posts", id, "comments"), {
      comment: commentToSend,
      username: displayName,
      userImg: currentUserImg,
      timestamp: serverTimestamp(),
    });
  };

  const onEmojiClick = (event, emojiObject) => {
    setComment((prevInput) => prevInput + emojiObject.emoji);
    //setShowPicker(false);
  };
  return (
    <div className="post__post">
      <div className="post__info">
        <div className="post__user">
          <Link to={`/profile/${username}`}>
            <div className="post__profile-pic">
              <img src={profileImg} alt="" />
            </div>
          </Link>
          <div>
            <Link to={`/profile/${username}`}>
              <p className="post__username">{username}</p>
            </Link>
            <p className="post__location">{location}</p>
          </div>
        </div>
        <img className="post__options" src={option} alt="" />
      </div>
      <img
        className="post__post-image"
        onDoubleClick={likePost}
        src={postImg}
        alt=""
      />
      <div className="post__post-content">
        <div className="post__reaction-wrapper">
          {hasLiked ? (
            <FavoriteFilledIcon
              onClick={likePost}
              className="post__icon"
              color="secondary"
            />
          ) : (
            <FavoriteIcon onClick={likePost} className="post__icon" />
          )}

          <ChatIcon className="post__icon" />
          <SendIcon className="post__icon" />
          <img className={`post__icon post__save`} src={save} alt="" />
        </div>
        {likes.length > 0 &&
          (likes.length > 1 ? (
            <p className="post__likes">{likes.length} likes</p>
          ) : (
            <p className="post__likes">{likes.length} like</p>
          ))}

        <p className="post__description">
          <span>{username} </span>
          {caption}
        </p>
        {totalComments > 0 &&
          (totalComments > 1 ? (
            <p onClick={postDetails} className="post__comment-number">
              View all {totalComments} comments
            </p>
          ) : (
            <p onClick={postDetails} className="post__comment-number">
              View {totalComments} comment
            </p>
          ))}
        <p className="post__post-time">2 minutes ago</p>
      </div>
      <form>
        <div className="post__comment-wrapper">
          <div>
            <SmileyIcon onClick={() => setShowPicker((val) => !val)} />
          </div>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="post__comment-box"
            placeholder="Add a comment"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="post__comment-btn"
            onClick={sendComment}
          >
            post
          </button>
        </div>
      </form>
      <div className="post__picker-container">
        {showPicker && <Picker onEmojiClick={onEmojiClick} />}
      </div>
    </div>
  );
}

export default Post;
