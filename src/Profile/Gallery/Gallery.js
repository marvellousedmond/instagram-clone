import React, { useEffect, useState } from "react";
import "./Gallery.css";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import { db } from "../../Firebase/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

function Gallery({
  setModalOpen,
  setSinglePost,
  username,
  caption,
  postImg,
  profileImg,
  id,
}) {

  
  const [totalComments, setTotalComments] = useState(0);

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

  const selectPost = () => {
    setModalOpen(true);
    setSinglePost({
      postImage: postImg,
      postName: username,
      postCaption: caption,
      profileImage: profileImg,
      postid: id,
    });
  };
  return (
    <>
      <div onClick={selectPost} className="gallery__item" tabIndex={0}>
        <img src={postImg} alt="gallery" className="gallery__image" />
        <div className="gallery__item-type">
          <span className="gallery__visually-hidden">Gallery</span>
          {/*<FileCopyOutlinedIcon aria-hidden />*/}
        </div>
        <div className="gallery__item-info">
          <ul>
            <li className="gallery__item-comments">
              <span className="gallery__visually-hidden">Comments:</span>
              <ChatBubbleOutlineOutlinedIcon
                className="gallery__fa-comment"
                aria-hidden
              />
              {totalComments}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Gallery;
