import React, { useEffect, useRef, useState } from "react";
import "./EditModal.css";
import CloseIcon from "@material-ui/icons/Close";
import PersonIcon from "@material-ui/icons/Person";
import { db, storage } from "../../Firebase/firebase";
import { useUserContext } from "../../Context/UserContext";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  where,
  query,
} from "firebase/firestore";
import { updateProfile, updateEmail } from "firebase/auth";
import { ref, getDownloadURL, uploadString } from "firebase/storage";
import MiniLoader from "../../MiniLoader/MiniLoader";

function EditModal({ closeEditProfileModal, setEditProfile }) {
  const { currentUser } = useUserContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const usernameRef = useRef(null);
  const EmailRef = useRef(null);

  useEffect(() => {
    console.log(currentUser);
  }, []);

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  console.log(currentUser.photoUrl);

  const uploadPost = async () => {
    if (loading) return;
    setLoading(true);

    {/*if (usernameRef !== null && currentUser.displayName !== usernameRef) {
      await updateDoc(
        query(collection(db, "posts"), where("username", "==", currentUser.displayName)),
        {
          username: usernameRef,
        }
      );
      await updateProfile(currentUser, { displayName: usernameRef });
    }

    if (EmailRef !== null && EmailRef !== currentUser.email) {
      await updateEmail(currentUser , EmailRef);
    }*/}

    const imageRef = ref(storage, `profileImg/${currentUser.uid}/image`);

    await uploadString(imageRef, selectedFile, "data_url").then(
      async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateProfile(currentUser, { photoURL: downloadURL });
        {/*await updateDoc(
          query(collection(db, "posts"), where("username", "==", currentUser.displayName)),
          {
            profileImg: downloadURL,
          }
        );*/}
      }
    );

    setLoading(false);
    setEditProfile(false)
  };

  return (
    <div className="editmodal__container">
      <div className="editmodal__close-modal" onClick={closeEditProfileModal}>
        <CloseIcon fontSize="large" />
      </div>
      <div className="editmodal__modal">
        <div className="editmodal__wrapper">
          {selectedFile ? (
            <>
              <div className="editmodal__image">
                <img
                  disabled={loading}
                  onClick={() => filePickerRef.current.click()}
                  src={selectedFile}
                  alt=""
                />
              </div>
              <div hidden={loading} className="editmodal__cancel-btn">
                <CloseIcon
                  onClick={() => setSelectedFile(null)}
                  fontSize="large"
                />
              </div>
              <div
                onClick={() => filePickerRef.current.click()}
                className="editmodal__file-name"
              >
                Choose a file
              </div>
            </>
          ) : (
            <>
              <div className="editmodal__content">
                <PersonIcon />
                <div className="editmodal__text">No file chosen, yet</div>
              </div>
              <div
                onClick={() => filePickerRef.current.click()}
                className="editmodal__file-name"
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
          className="editmodal__default-btn"
        />
        <input
          type="text"
          ref={usernameRef}
          className="editmodal__caption"
          placeholder="Change Username"
        />
        <input
          type="email"
          ref={EmailRef}
          className="editmodal__caption"
          placeholder="Change your Email"
        />
        <button
          disabled={!selectedFile && loading}
          onClick={uploadPost}
          className="editmodal__custom-btn"
        >
          {loading ? <MiniLoader /> : "Update Profile"}
        </button>
      </div>
    </div>
  );
}

export default EditModal;
