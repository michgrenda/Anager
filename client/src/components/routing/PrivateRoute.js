import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
// Redux
import { connect } from "react-redux";

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated ? (
        <CSSTransition
          in={props.match !== null}
          timeout={400}
          appear
          classNames="page"
          unmountOnExit
          exit={false}
        >
          <Component {...props} />
        </CSSTransition>
      ) : (
        <Redirect to="sign-in" />
      )
    }
  />
);

PrivateRoute.propTypes = {
  // Redux
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
