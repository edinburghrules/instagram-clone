import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import useAuthListener from "./hooks/use-auth-listener";
import UserContext from "./context/user";

const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/signup"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const NotFound = lazy(() => import("./pages/not-found"));

export default function App() {
  //   useAuthListener returns a user object when the
  //   auth state from firebase changes e.g. sign in.
  //   The user object is then passed in as the value to
  //   UserContext Provider, so all child components have access
  //   to the user object.
  const { user } = useAuthListener();

  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route path={ROUTES.LOGIN} component={Login} />
            <Route path={ROUTES.SIGN_UP} component={Signup} />
            <Route path={ROUTES.DASHBOARD} component={Dashboard} />
            <Route path={ROUTES.NOT_FOUND} component={NotFound} />
          </Switch>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
}

// 5:23:13

// SEMANTIC COMMIT MESSAGES
// chore: add Oyster build script
// docs: explain hat wobble
// feat: add beta sequence
// fix: remove broken confirmation message
// refactor: share logic between 4d3d3d3 and flarhgunnstow
// style: convert tabs to spaces
// test: ensure Tayne retains clothing
