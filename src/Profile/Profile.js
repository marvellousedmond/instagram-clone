import React, { useEffect, useState } from "react";
import "./Profile.css";
import Gallery from "./Gallery/Gallery";
import PostModal from "../Modals/PostModal/PostModal";
import { useParams } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";
import Loader from "../Loader/Loader";

function Profile() {
  const { username } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [totalpost, setTotalpost] = useState(0);
  const [singlePost, setSinglePost] = useState({
    postImage: "",
    postName: "",
    postCaption: "",
    profileImage: "",
    postid: 0,
  });
  const [profile, setProfile] = useState([]);
  const [photoURL, setPhotoURL] = useState(
    "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg"
  );

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "profile"), where("username", "==", username)),
      (snapshot) => {
        setProfile(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), where("username", "==", username)),
      (snapshot) => {
        setTotalpost(snapshot.docs.length);
        setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  return (
    <>
      <header>
        <div className="profile__container">
          {profile.map((profile) => (
            <div className="profile__">
              <div className="profile__image">
                <img src={profile?.imgUrl} alt="user" />
              </div>
              <div className="profile__user-setting">
                <h1 className="profile__username">{username}</h1>
              </div>
              <div className="profile__stats">
                <ul>
                  <li>
                    <span className="profile__stats-count">{totalpost}</span>{" "}
                    posts
                  </li>
                  <li>
                    <span className="profile__real-name">Email </span>{" "}
                    {profile?.email}
                  </li>
                </ul>
              </div>
              <div className="profile__bio">
                <div className="profile__bio">
                  <p>{profile?.bio}</p>
                </div>
              </div>
            </div>
          ))}

          {/* End of Profile Section */}
        </div>
        {/* End of Container */}
      </header>
      <main>
        <div className="profile__container">
          <div className="profile__gallery">
            {loading ? (
              <Loader />
            ) : (
              posts.map((post) => (
                <Gallery
                  key={post.id}
                  id={post.id}
                  username={post.username}
                  location={post.location}
                  postImg={post.imageUrl}
                  profileImg={post.profileImg}
                  caption={post.caption}
                  setSinglePost={setSinglePost}
                  setModalOpen={setModalOpen}
                />
              ))
            )}
          </div>
        </div>

        {/* End of Gallery */}
      </main>
      {
        modalOpen && <PostModal singlePost={singlePost} setShowModal={setModalOpen} />
      }
    </>
  );
}

export default Profile;
