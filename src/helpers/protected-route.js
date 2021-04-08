import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import * as ROUTES from "../constants/routes";

// If we have user, return the children component.
// If not, redirect to login.
export default function ProtectedRoute({ user, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={() => {
        if (user) return children;

        if (!user) return <Redirect to={{ pathname: ROUTES.LOGIN }} />;

        return null;
      }}
    />
  );
}

ProtectedRoute.propTypes = {
  user: PropTypes.object,
  children: PropTypes.object.isRequired,
};
