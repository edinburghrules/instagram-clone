import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";
import * as ROUTES from "../constants/routes";

// If we have user, return the passed in component.
// If not, redirect to login.
export default function ProtectedRoute({
  user,
  component: Component,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={() => {
        if (user) return <Component />;

        if (!user) return <Redirect to={{ pathname: ROUTES.LOGIN }} />;

        return null;
      }}
    />
  );
}

ProtectedRoute.propTypes = {
  user: PropTypes.object,
  component: PropTypes.object.isRequired,
};
