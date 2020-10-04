import React, { useEffect, useRef, useState, useCallback } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { BounceLoader } from "react-spinners";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
// Components
import Navbar from "./components/layouts/Navbar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import SignOut from "./components/auth/SignOut";
import Projects from "./components/projects/Projects";
import PrivateRoute from "./components/routing/PrivateRoute";
import Footer from "./components/layouts/Footer";
import PageNotFound from "./components/routing/PageNotFound";
import ScrollToTop from "./ScrollToTop";
import Landing from "./components/layouts/Landing";

const routes = [
  {
    path: "/",
    exact: true,
    privatePath: false,
    component: Landing,
  },
  {
    path: "/sign-up",
    exact: true,
    privatePath: false,
    component: SignUp,
  },
  {
    path: "/sign-in",
    exact: true,
    privatePath: false,
    component: SignIn,
  },
  {
    path: "/sign-out",
    exact: true,
    privatePath: false,
    component: SignOut,
  },
  {
    path: "/dashboard",
    exact: true,
    privatePath: true,
    component: Projects,
  },
  {
    path: "/",
    exact: false,
    privatePath: false,
    component: PageNotFound,
  },
];

const App = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [resizeTimer, setResizeTimer] = useState(null);

  // References
  const main = useRef(null);

  useEffect(() => {
    setAuthToken(localStorage.token);
    store
      .dispatch(loadUser())
      .catch((error) => console.log(error))
      .finally(() => setLoading(store.getState().auth.loading));
  }, []);

  // Stop animations during window resizing ***
  const handleWindowResize = useCallback(() => {
    document.body.classList.add("resize-animation-transition-stopper");

    clearTimeout(resizeTimer);
    setResizeTimer(
      setTimeout(() => {
        document.body.classList.remove("resize-animation-transition-stopper");
      }, 400)
    );
  }, [resizeTimer]);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => window.removeEventListener("resize", handleWindowResize);
  }, [handleWindowResize]);
  // End ***

  // Variables
  const transitionClassNames = "next-to-page";
  const transitionDuration = 700;
  const pageTransitionClassNames = "page";
  const pageTransitionDuration = 700;

  return (
    <Provider store={store}>
      <BrowserRouter>
        {!loading ? (
          <>
            <ScrollToTop />
            <CSSTransition
              in
              timeout={transitionDuration}
              appear
              classNames={transitionClassNames}
              exit={false}
            >
              <Navbar main={main} />
            </CSSTransition>
            <main className="main" ref={main}>
              <div className="container">
                <div className="row h-100">
                  <Switch>
                    {routes.map(
                      ({ path, exact, privatePath, component: Component }) =>
                        !privatePath ? (
                          <Route
                            key={path}
                            exact={exact}
                            path={path}
                            render={(props) => (
                              <CSSTransition
                                in={props.match !== null}
                                timeout={pageTransitionDuration}
                                appear
                                classNames={pageTransitionClassNames}
                                unmountOnExit
                                exit={false}
                              >
                                <Component {...props} />
                              </CSSTransition>
                            )}
                          />
                        ) : (
                          <PrivateRoute
                            key={path}
                            exact={exact}
                            path={path}
                            component={Projects}
                          />
                        )
                    )}
                  </Switch>
                </div>
              </div>
            </main>
            <CSSTransition
              in
              timeout={transitionDuration}
              appear
              classNames={transitionClassNames}
              exit={false}
            >
              <Footer />
            </CSSTransition>
          </>
        ) : (
          <BounceLoader
            css="margin: auto auto;"
            size={150}
            color="rgba(173, 191, 204, 0.25)"
          />
        )}
      </BrowserRouter>
    </Provider>
  );
};

export default App;
