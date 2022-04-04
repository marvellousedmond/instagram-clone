import { Redirect, Route, useParams } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";

export const AuthRoute = ({ component: RouteComponent, ...props }) => {
  const { currentUser } = useUserContext();
  return (
    <Route
      {...props}
      render={(routeProps) =>
        !currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/"} />
        )
      }
    />
  );
};

export const PrivateRoute = ({ component: RouteComponent, ...props }) => {
  const { currentUser } = useUserContext();
  //console.log(user);
  return (
    <Route
      {...props}
      render={(routeProps) =>
        !currentUser ? (
          <Redirect to={"/login"} />
        ) : (
          <RouteComponent {...routeProps} />
        )
      }
    />
  );
};

