//import logo from './logo.svg';
import "./App.css";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home/Home";
import { UserContextProvider, UserContext } from "./Context/UserContext";
import { AuthRoute, PrivateRoute, ProfileRoute } from "./Routes/routes";
import { useState } from "react";
import Profile from "./Profile/Profile";

function App() {
  return (
    <>
    <head>
    </head>
      <UserContextProvider>
        <Router>
          <div className="app">
            <AuthRoute exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={Home} />
            <Route exact path="/profile/:username" component={Profile} />
          </div>
        </Router>
      </UserContextProvider>
    </>
  );
}

export default App;
