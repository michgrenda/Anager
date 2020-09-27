import React, { useEffect, useState, useCallback } from "react";
import { useHistory, Link } from "react-router-dom";
// Components
import Button from "../Button";

const SignOut = () => {
  // State
  const [inactivityTimeout, setInactivityTimeout] = useState(null);

  // Router
  let history = useHistory();

  const startInacitivtyTimeout = useCallback(() => {
    setInactivityTimeout(setTimeout(() => history.push("/"), 5000));
  }, [history]);

  // Redirect after a few seconds
  const resetInacitivtyTimeout = useCallback(() => {
    clearTimeout(inactivityTimeout);
    startInacitivtyTimeout();
  }, [startInacitivtyTimeout, inactivityTimeout]);

  useEffect(() => {
    window.addEventListener("click", resetInacitivtyTimeout);

    return () => {
      window.removeEventListener("click", resetInacitivtyTimeout);
      clearTimeout(inactivityTimeout);
    };
  }, [resetInacitivtyTimeout, inactivityTimeout]);

  useEffect(() => startInacitivtyTimeout(), [startInacitivtyTimeout]);

  return (
    <div className="sign-out">
      <span className="sign-out__text">
        <p className="sign-out__text--main">Feel free to visit us again!</p>
        <p className="sign-out__subtext">
          You will be automatically forwarded in 5 seconds, or just click on the
          link.
        </p>
      </span>
      <Link className="sign-out__link" to="/">
        Home
      </Link>
    </div>
  );
};

export default SignOut;
