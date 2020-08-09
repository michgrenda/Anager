import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";
import { SignUp } from "./components/auth/SignUp";
import { SignIn } from "./components/auth/SignIn";

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <main>
        <div className="container">
          <Switch>
            <Route exact path="/sign-up" component={SignUp} />
            <Route exact path="/sign-in" component={SignIn} />
          </Switch>
        </div>
      </main>
      {/* <div style={{ height: "150vh" }}></div> */}
    </Fragment>
  </Router>
);

export default App;
