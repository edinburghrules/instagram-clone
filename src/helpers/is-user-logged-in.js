import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

// Stop logged in user seeing signin or signup page.
// If we don't have a user, render to child component.
// If we do, redirect them to the dashboard.
export default function IsUserLoggedIn({ user, loggedInPath, children, rest }) {
  return (
    <Route
      {...rest}
      render={() => {
        if (!user) return children;

        if (user) return <Redirect to={{ pathname: loggedInPath }} />;

        return null;
      }}
    />
  );
}

IsUserLoggedIn.propTypes = {
  user: PropTypes.object,
  loggedInPath: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
};
