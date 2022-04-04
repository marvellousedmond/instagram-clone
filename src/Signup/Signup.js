import React, { useCallback, useRef, useState } from "react";
import "./Signup.css";
import instagram from "./images/instagram.png";
import appstore from "./images/appstore.png";
import googleplay from "./images/googleplay.png";
import facebook from "./images/facebook.png";
import { Link, Redirect, useHistory, withRouter } from "react-router-dom";
import { signup } from "../Firebase/firebase";
import { useUserContext } from "../Context/UserContext";
import MiniLoader from "../MiniLoader/MiniLoader";

const img = {
  width: "175px",
};

function Signup({ history }) {
/*   const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const [loading, setloading] = useState(false);

  const { currentUser, registerUser } = useUserContext();

  const handleSignup = useCallback(() => {
    setloading(true);
    const email = emailRef.current.value;
    const name = nameRef.current.value;
    const password = passwordRef.current.value;

    if (email && password && name) {
      const registered = registerUser(email, name, password);
      registered && history.push("/");
    }
  }, [history]); */

  return (
    <div className="signup__wrapper">
      <div className="signup__header">
        <div className="signup__top">
          <div className="signup__logo">
            <img src={instagram} alt="instagram" style={img} />
          </div>
          <div className="signup__form">
            {/* <div className="signup__input-field">
              <input
                type="text"
                ref={nameRef}
                placeholder="username"
                className="signup__input"
              />
            </div>
            <div className="signup__input-field">
              <input
                type="text"
                ref={emailRef}
                placeholder="Email"
                className="signup__input"
              />
            </div>
            <div className="signup__input-field">
              <input
                type="password"
                ref={passwordRef}
                placeholder="Password"
                className="signup__input"
              />
            </div>
            <div>
              <button
                disabled={loading}
                className="signup__btn"
                onClick={handleSignup}
              >
                {loading ? (
                  <MiniLoader />
                ) : (
                  <span className="signup__btn-text">Sign In</span>
                )}
              </button>
            </div> */}
          </div>
          <div className="signup__or">
            <div className="signup__line"></div>
            <p>OR</p>
            <div className="signup__line"></div>
          </div>
          <div className="signup__dif">
            <div className="signup__fb">
              <img src={facebook} alt="facebook" />
              <p>Log in with Facebook</p>
            </div>
          </div>
        </div>
        <div className="signup__signup">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
        <div className="signup__apps">
          <p>Get the app.</p>
          <div className="signup__icons">
            <a href="#">
              <img src={appstore} alt="appstore" />
            </a>
            <a href="#">
              <img src={googleplay} alt="googleplay" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Signup);
