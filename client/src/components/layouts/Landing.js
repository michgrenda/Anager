import React from "react";
import { Redirect } from "react-router-dom";
// Redux
import { connect } from "react-redux";

const Landing = (props) => {
  // Redux
  const { isAuthenticated } = props;
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return <div>Home</div>;
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
