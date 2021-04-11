import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import useAuthListener from "./hooks/use-auth-listener";
import UserContext from "./context/user";
import ProtectedRoute from "./helpers/protected-route";
import IsUserLoggedIn from "./helpers/is-user-logged-in";

const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/signup"));
const Profile = lazy(() => import("./pages/profile"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const NotFound = lazy(() => import("./pages/not-found"));

//   useAuthListener returns a user object when the
//   auth state from firebase changes e.g. sign in.
//   The user object is then passed in as the value to
//   UserContext Provider, so all child components have access
//   to the user object.
export default function App() {
  const { user } = useAuthListener();
  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <ProtectedRoute
              component={Dashboard}
              user={user}
              path={ROUTES.DASHBOARD}
              exact
            />

            <IsUserLoggedIn
              user={user}
              loggedInPath={ROUTES.DASHBOARD}
              path={ROUTES.LOGIN}
              component={Login}
            />

            <IsUserLoggedIn
              user={user}
              loggedInPath={ROUTES.DASHBOARD}
              path={ROUTES.SIGN_UP}
              component={Signup}
            />

            <Route component={Profile} path={ROUTES.PROFILE} />

            <Route path={ROUTES.NOT_FOUND} component={NotFound} />
          </Switch>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
}

// 9:56:46

// SEMANTIC COMMIT MESSAGES
// chore: add Oyster build script
// docs: explain hat wobble
// feat: add beta sequence
// fix: remove broken confirmation message
// refactor: share logic between 4d3d3d3 and flarhgunnstow
// style: convert tabs to spaces
// test: ensure Tayne retains clothing
