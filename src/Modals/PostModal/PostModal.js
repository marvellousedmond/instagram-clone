import React, { useRef, useState } from "react";
import "./PostModal.css";
import CloseIcon from "@material-ui/icons/Close";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import RecordIcon from "@material-ui/icons/FiberManualRecord";
import Comment from "../../Comment/Comment";
import FavoriteIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteFilledIcon from "@material-ui/icons/FavoriteOutlined";
import ModeCommentIcon from "@material-ui/icons/ModeCommentOutlined";
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import BookmarkIcon from "@material-ui/icons/BookmarkBorderOutlined";
import SmileIcon from "@material-ui/icons/SentimentSatisfiedOutlined";
import MiniLoader from "../../MiniLoader/MiniLoader";
import { useEffect } from "react";
import {
  deleteDoc,
  setDoc,
  doc,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import { useUserContext } from "../../Context/UserContext";
import Picker from "emoji-picker-react";

function PostModal({ setShowModal, singlePost }) {
  const { currentUser } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const modalRef = useRef();

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", singlePost.postid, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );
        }
      ),
    [db]
  );

  useEffect(() => {
    onSnapshot(
      collection(db, "posts", singlePost.postid, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
  }, [db, singlePost.postid]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes]);

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(
        doc(db, "posts", singlePost.postid, "likes", currentUser?.uid)
      );
    } else {
      await setDoc(
        doc(db, "posts", singlePost.postid, "likes", currentUser?.uid),
        {
          username: currentUser?.displayName,
        }
      );
    }
  };

  const deletePost = async () => {
    await deleteDoc(doc(db, "posts", singlePost.postid)).then(
      setShowModal(false)
    );
  };

  const sendComment = async (e) => {
    e.preventDefault();

    const commentToSend = comment;
    setComment("");

    await addDoc(collection(db, "posts", singlePost.postid, "comments"), {
      comment: commentToSend,
      username: currentUser?.displayName,
      userImg: currentUser?.photoURL,
      timestamp: serverTimestamp(),
    });
  };

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    setComment((prevInput) => prevInput + emojiObject.emoji);
    //setShowPicker(false);
  };

  return (
    <div ref={modalRef} onClick={closeModal} className="postmodal__container">
      <div
        className="postmodal__close-modal"
        onClick={() => setShowModal(false)}
      >
        <CloseIcon fontSize="large" />
      </div>
      <div className="postmodal__modal">
        <img
          className="postmodal__image"
          onDoubleClick={likePost}
          src={singlePost.postImage}
          alt=""
        />
        <div className="postmodal__content-section">
          <div className="postmodal__top-section">
            <img src={singlePost.profileImage} />
            <div className="postmodal__username">{singlePost.postName}. </div>
            <button></button>
            <div className="postmodal__spacer"></div>
            {currentUser?.displayName == singlePost.postName && (
              <DeleteForeverRoundedIcon onClick={deletePost} fontSize="large" />
            )}
          </div>
          <div className="postmodal__comment">
            <div className="postmodal__caption-container">
              <img
                className="postmodal__caption-image"
                src={singlePost.profileImage}
                alt=""
              />
              <div>
                <div>
                  <span className="postmodal__caption-username">
                    {singlePost.postName}
                  </span>
                  <span>{singlePost.postCaption}</span>
                </div>
              </div>
            </div>
            <div className="postmodal__comment-section">
              {loading ? (
                <MiniLoader />
              ) : (
                comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    id={comment.id}
                    postId={singlePost.postid}
                    comment={comment.comment}
                    userImg={comment.userImg}
                    username={comment.username}
                  />
                ))
              )}
            </div>
          </div>
          <div className="postmodal__detail-section">
            <div className="postmodal__detail-action">
              {hasLiked ? (
                <FavoriteFilledIcon
                  onClick={likePost}
                  fontSize="large"
                  className="postmodal__detail-icon"
                  color="secondary"
                />
              ) : (
                <FavoriteIcon
                  fontSize="large"
                  onClick={likePost}
                  className="postmodal__detail-icon"
                />
              )}
              <ModeCommentIcon
                fontSize="large"
                className="postmodal__detail-icon"
              />
              <div className="postmodal__spacer"></div>
              <BookmarkIcon
                fontSize="large"
                className="postmodal__detail-icon"
              />
            </div>
            {likes.length > 0 ? (
              likes.length > 1 ? (
                <span>{likes.length} likes</span>
              ) : (
                <span>{likes.length} like</span>
              )
            ) : (
              <span>0 likes</span>
            )}
          </div>
          <form>
            <div className="postmodal__comment-wrapper">
              <SmileIcon onClick={() => setShowPicker((val) => !val)} />
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="postmodal__comment-box"
                placeholder="Add a comment"
              />
              <button
                disabled={!comment.trim()}
                onClick={sendComment}
                type="submit"
                className="postmodal__comment-btn"
              >
                post
              </button>
            </div>
          </form>
          <div className="postmodal__picker-container">
            {showPicker && <Picker onEmojiClick={onEmojiClick} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostModal;
