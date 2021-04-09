import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

// Stop logged in user seeing signin or signup page.
// If we don't have a user, render passed in component (Login or Signup).
// If we do, redirect them to the dashboard.
export default function IsUserLoggedIn({
  user,
  loggedInPath,
  component: Component,
  rest,
}) {
  console.log(user);
  return (
    <Route
      {...rest}
      render={() => {
        if (user) return <Redirect to={{ pathname: loggedInPath }} />;

        if (!user) return <Component />;

        return null;
      }}
    />
  );
}

IsUserLoggedIn.propTypes = {
  user: PropTypes.object,
  loggedInPath: PropTypes.string.isRequired,
  component: PropTypes.object.isRequired,
};
