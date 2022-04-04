import React, { useEffect, useRef, useState } from "react";
import "./AddPostModal.css";
import CloseIcon from "@material-ui/icons/Close";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { db, storage } from "../../Firebase/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import MiniLoader from "../../MiniLoader/MiniLoader";

function AddPostModal({ username, setModalOpen, currentUser }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const locationRef = useRef(null);
  const captionRef = useRef(null);
  const modalRef = useRef();


  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const uploadPost = async () => {

    setLoading(true);
    if (loading) return;

    const docRef = await addDoc(collection(db, "posts"), {
      username: username,
      caption: captionRef.current.value,
      location: locationRef.current.value,
      profileImg: currentUser.photoURL,
      timestamp: serverTimestamp(),
    });

    console.log("New doc added with ID", docRef.id);

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          imageUrl: downloadURL,
        });
      }
    );

    setLoading(false);
    setModalOpen(false);
    setSelectedFile(null);
  };

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      setModalOpen(false);
    }
  }

  return (
    <div ref={modalRef} onClick={closeModal} className="addpostmodal__container">
      <div className="addpostmodal__close-modal" onClick={() => setModalOpen(false)}>
        <CloseIcon fontSize="large" />
      </div>
      <div className="addpostmodal__modal">
        <div className="addpostmodal__wrapper">
          {selectedFile ? (
            <>
              <div className="addpostmodal__image">
                <img
                  disabled={loading}
                  onClick={() => filePickerRef.current.click()}
                  src={selectedFile}
                  alt=""
                />
              </div>
              <div hidden={loading} className="addpostmodal__cancel-btn">
                <CloseIcon
                  onClick={() => setSelectedFile(null)}
                  fontSize="large"
                />
              </div>
            </>
          ) : (
            <>
              <div className="addpostmodal__content">
                <CloudUploadIcon/>
                <div className="addpostmodal__text">No file chosen, yet</div>
              </div>
              <div
                onClick={() => filePickerRef.current.click()}
                className="addpostmodal__file-name"
              >
                Choose a file
              </div>
            </>
          )}
        </div>
        <input
          type="file"
          ref={filePickerRef}
          hidden
          onChange={addImageToPost}
          className="addpostmodal__default-btn"
        />
        <input
          type="text"
          ref={captionRef}
          className="addpostmodal__caption"
          placeholder="Add a Caption"
        />
        <input
          type="text"
          ref={locationRef}
          className="addpostmodal__caption"
          placeholder="Location"
        />
        <button disabled={!selectedFile && loading} onClick={uploadPost} className="addpostmodal__custom-btn">
          {loading ? <MiniLoader/> : "Upload Post" }
        </button>
      </div>
    </div>
  );
}

export default AddPostModal;
