import React, { useCallback, useState } from "react";
import "./Login.css";
import instagram from "./images/instagram.png";
import appstore from "./images/appstore.png";
import googleplay from "./images/googleplay.png";
import facebook from "./images/facebook.png";
import { Link, useHistory } from "react-router-dom";
import { useRef } from "react";
import { useUserContext } from "../Context/UserContext";
import MiniLoader from "../MiniLoader/MiniLoader";

const img = {
  width: "175px",
};

function Login() {
  const history = useHistory();
  const { signInUser, signInWithGoogle } = useUserContext();
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  const demoLogin = useCallback(
    (e) => {
      setLoading(true);
      e.preventDefault();
      const email = process.env.REACT_APP_EMAIL;
      const password = process.env.REACT_APP_PASSWORD;

      if (email && password) {
        const signedIn = signInUser(email, password);
        signedIn && history.push("/");
      }
    },
    [history]
  );

  const googleLogin = (e) => {
    setLoading(true);
    const signedIn = signInWithGoogle();
    signedIn && history.push("/");
  }

  return (
    <div className="login__wrapper">
      <div className="login__header">
        <div className="login__top">
          <div className="login__logo">
            <img src={instagram} alt="instagram" style={img} />
          </div>
          <div className="">
          <div className="login__dif">
            <div>
              <button
                disabled={loading}
                className="login__btn"
                onClick={demoLogin}
              >
                {loading ? (
                  <MiniLoader />
                ) : (
                  <span className="login__btn-text">Use Demo Login</span>
                )}
              </button>
            </div>
          </div>
          </div>
          <div className="login__or">
            <div className="login__line"></div>
            <p>OR</p>
            <div className="login__line"></div>
          </div>
          <div className="login__dif">
            <div>
              <button
                disabled={loading}
                className="login__btn"
                onClick={googleLogin}
              >
                {loading ? (
                  <MiniLoader />
                ) : (
                  <span className="login__btn-text">Sign in with Google</span>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="login__signup">
          <p>
            forget Password? <Link to="/signup">reset password</Link>
          </p>
        </div>
        <div className="login__apps">
          <p>Get the app.</p>
          <div className="login__icons">
            <a href="">
              <img src={appstore} alt="appstore" />
            </a>
            <a href="">
              <img src={googleplay} alt="googleplay" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
