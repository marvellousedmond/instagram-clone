import React from "react";
import logo from "./img/logo.PNG";
import cover9 from "./img/cover 9.png";
import "./Home.css";
import Post from "../Post/Post";
import { db } from "../Firebase/firebase";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useUserContext } from "../Context/UserContext";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import AddPostModal from "../Modals/AddPostModal/AddPostModal";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import PostModal from "../Modals/PostModal/PostModal";
import EditModal from "../Modals/EditModal/EditModal";

function Home() {
  const { currentUser, logoutUser, loading, setLoading } = useUserContext();
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState();
  const [userInfo, setUserInfo] = useState([]);
  const [profile, setProfile] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editBio, setEditBio] = useState(false);
  const [singlePost, setSinglePost] = useState({
    postImage: "",
    postName: "",
    postCaption: "",
    profileImage: "",
    postid: 0,
  });
  const addPost = (props) => {
    setModalOpen(true);
  };
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        //console.log(snapshot.docs.map((doc) => doc.data()))
        setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, "profile"), (snapshot) => {
      setProfile(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      query(
        collection(db, "profile"),
        where("username", "==", currentUser?.displayName)
      ),
      (snapshot) => {
        setUserInfo(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
        setLoading(false);
      }
    );
    return unsub;
  }, [currentUser]);

  return (
    <div>
      <nav className="home__navbar">
        <div className="home__nav-wrapper">
          <img src={logo} alt="instagram" className="home__brand-img" />
          {/*<input
            type="text"
            className="home__search-box"
            placeholder="search"
          />*/}
          <div className="home__nav-items">
            <HomeRoundedIcon fontSize="large" className="home__icon" />
            <AddCircleOutlineOutlinedIcon
              fontSize="large"
              className="home__icon"
              onClick={addPost}
            />
            <ExitToAppRoundedIcon
              fontSize="large"
              className="home__icon"
              onClick={() => logoutUser()}
            />
            {currentUser?.photoURL == null ? (
              <Link to={`/profile/${currentUser?.displayName}`}>
                <img
                  src="https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg"
                  className={`home__icon home__user-profile`}
                  alt=""
                />
              </Link>
            ) : (
              <Link to={`/profile/${currentUser?.displayName}`}>
                <img
                  src={currentUser?.photoURL}
                  className={`home__icon home__user-profile`}
                  alt=""
                />
              </Link>
            )}
          </div>
        </div>
      </nav>
      <section className="home__main">
        <div className="home__wrapper">
          <div className="home__left-col">
            <div className="home__status-wrapper">
              {profile.map((profile) => (
                <div className="home__status-card">
                  <div className="home__profile-pic">
                    <img src={profile.imgUrl} alt="" />
                  </div>
                  <p className="home__username">{profile.username}</p>
                </div>
              ))}
            </div>
            {loading ? (
              <Loader />
            ) : (
              posts.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  username={post.username}
                  setSinglePost={setSinglePost}
                  displayName={currentUser?.displayName}
                  location={post.location}
                  postImg={post.imageUrl}
                  currentUserImg={currentUser?.photoURL}
                  profileImg={post.profileImg}
                  caption={post.caption}
                  setShowModal={setShowModal}
                  setModalOpen={setModalOpen}
                />
              ))
            )}
          </div>
          <div className="home__right-col">
            <div className="home__profile-card">
              {currentUser?.photoURL == null ? (
                <div className="home__profile-pic">
                  <Link to={`/profile/${currentUser?.displayName}`}>
                    <img
                      src="https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg"
                      alt=""
                    />
                  </Link>
                </div>
              ) : (
                <div className="home__profile-pic">
                  <Link to={`/profile/${currentUser?.displayName}`}>
                    <img src={currentUser?.photoURL} alt="" />
                  </Link>
                </div>
              )}
              <div>
                <Link to={`/profile/${currentUser?.displayName}`}>
                  <p className="home__username">{currentUser?.displayName}</p>
                </Link>
                <p className="home__sub-text">React Developer</p>
              </div>
            </div>
            <p className="home__suggestion-text">About you</p>
            {userInfo.map((user) => (
              <>
                <div className="home__profile-card">
                  <div>
                    <p className="home__username">Personal Biography</p>
                    <p className="home__sub-text">{user.bio}</p>
                  </div>
                </div>
                <div className="home__profile-card">
                  <div>
                    <p className="home__username">Email</p>
                    <p className="home__sub-text">{user.email}</p>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </section>
      {showModal && (
        <PostModal singlePost={singlePost} setShowModal={setShowModal} />
      )}
      {editBio && <EditModal setEditBio={setEditBio} userId={userId} />}
      {modalOpen && (
        <AddPostModal
          currentUser={currentUser}
          setModalOpen={setModalOpen}
          username={currentUser?.displayName}
        />
      )}
    </div>
  );
}

export default Home;
